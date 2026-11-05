import './styles.css';
import { ImageDecodeError, formatBytes, processImage, type Stage } from './processor';
import { getLang, getTranslator, type MessageKey } from './i18n';

const t = getTranslator(getLang());

function must<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }

  return element;
}

const dropzone = must<HTMLButtonElement>('#dropzone');
const fileInput = must<HTMLInputElement>('#file-input');
const fileList = must<HTMLUListElement>('#file-list');
const queueEmpty = must<HTMLParagraphElement>('#queue-empty');
const queueCount = must<HTMLSpanElement>('#queue-count');
const downloadAllButton = must<HTMLButtonElement>('#download-all');
const clearButton = must<HTMLButtonElement>('#clear');

const stageLabels: Record<Stage, MessageKey> = {
  decode: 'statusDecode',
  render: 'statusRender',
  encode: 'statusEncode',
  zip: 'statusZip',
};

type Status = 'queued' | 'processing' | 'done' | 'error';

interface Item {
  id: number;
  file: File;
  generation: number;
  status: Status;
  row: HTMLLIElement;
  meta: HTMLParagraphElement;
  statusLabel: HTMLSpanElement;
  action: HTMLDivElement;
  zipUrl?: string;
}

const items = new Map<number, Item>();
const queue: Item[] = [];
let nextId = 1;
let generation = 0;
let pumping = false;

function createRow(file: File, id: number): Pick<Item, 'row' | 'meta' | 'statusLabel' | 'action'> {
  const row = document.createElement('li');
  row.className = 'file-row';
  row.dataset.state = 'queued';

  const index = document.createElement('span');
  index.className = 'file-index';
  index.textContent = String(id).padStart(2, '0');
  index.setAttribute('aria-hidden', 'true');

  const detail = document.createElement('div');
  detail.className = 'file-detail';

  const name = document.createElement('p');
  name.className = 'file-name';
  name.textContent = file.name;
  name.title = file.name;

  const meta = document.createElement('p');
  meta.className = 'file-meta';
  meta.textContent = t('metaQueued', { size: formatBytes(file.size) });

  detail.append(name, meta);

  const result = document.createElement('div');
  result.className = 'file-result';

  const statusLabel = document.createElement('span');
  statusLabel.className = 'file-status';
  statusLabel.setAttribute('role', 'status');
  statusLabel.textContent = t('statusQueued');

  const action = document.createElement('div');
  action.className = 'file-action';

  result.append(statusLabel, action);
  row.append(index, detail, result);

  return { row, meta, statusLabel, action };
}

function setState(item: Item, status: Status, label: string) {
  item.status = status;
  item.row.dataset.state = status;
  item.statusLabel.textContent = label;
}

function failItem(item: Item, message: string) {
  setState(item, 'error', t('statusError'));
  item.meta.textContent = message;
  item.action.replaceChildren();
}

function syncControls() {
  const count = fileList.children.length;

  queueCount.textContent = `(${count})`;
  queueEmpty.hidden = count > 0;
  clearButton.disabled = count === 0;
  downloadAllButton.disabled = fileList.querySelector('a[data-zip]') === null;
}

async function pump() {
  if (pumping) {
    return;
  }

  pumping = true;

  try {
    while (queue.length > 0) {
      const item = queue.shift();

      if (!item || item.generation !== generation) {
        continue;
      }

      setState(item, 'processing', t('statusDecode'));

      try {
        const result = await processImage(item.file, (stage, info) => {
          if (item.generation !== generation) {
            return;
          }

          setState(item, 'processing', t(stageLabels[stage]));

          if (stage === 'render' && info) {
            item.meta.textContent = t('metaSource', {
              source: `${info.sourceWidth}×${info.sourceHeight}`,
            });
          }
        });

        if (item.generation !== generation) {
          continue;
        }

        const url = URL.createObjectURL(result.zipBlob);
        item.zipUrl = url;

        setState(item, 'done', t('statusDone'));
        item.meta.textContent = t('metaReady', {
          source: `${result.sourceWidth}×${result.sourceHeight}`,
          size: formatBytes(result.zipBlob.size),
        });

        const link = document.createElement('a');
        link.className = 'btn btn-download';
        link.href = url;
        link.download = result.zipName;
        link.textContent = t('downloadZip');
        link.title = result.zipName;
        link.dataset.zip = 'true';
        item.action.replaceChildren(link);
      } catch (error) {
        if (item.generation !== generation) {
          continue;
        }

        failItem(item, error instanceof ImageDecodeError ? t('errorDecode') : t('errorGeneric'));
      }

      syncControls();
    }
  } finally {
    pumping = false;
  }
}

function addFiles(files: FileList | File[]) {
  const list = Array.from(files);

  if (list.length === 0) {
    return;
  }

  for (const file of list) {
    const id = nextId++;
    const nodes = createRow(file, id);
    fileList.append(nodes.row);

    const item: Item = {
      id,
      file,
      generation,
      status: 'queued',
      ...nodes,
    };

    items.set(id, item);

    if (file.type && !file.type.startsWith('image/')) {
      failItem(item, t('errorUnsupported'));
      continue;
    }

    setState(item, 'queued', t('statusQueued'));
    queue.push(item);
  }

  syncControls();
  void pump();
}

function clearAll() {
  generation += 1;
  queue.length = 0;

  for (const item of items.values()) {
    if (item.zipUrl) {
      URL.revokeObjectURL(item.zipUrl);
    }
  }

  items.clear();
  fileList.replaceChildren();
  syncControls();
}

async function downloadAll() {
  const links = Array.from(fileList.querySelectorAll<HTMLAnchorElement>('a[data-zip]'));

  if (links.length === 0) {
    return;
  }

  downloadAllButton.disabled = true;

  for (const link of links) {
    link.click();
    await new Promise((resolve) => window.setTimeout(resolve, 350));
  }

  syncControls();
}

dropzone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  if (fileInput.files) {
    addFiles(fileInput.files);
  }

  fileInput.value = '';
});

let dragDepth = 0;

dropzone.addEventListener('dragenter', (event) => {
  event.preventDefault();
  dragDepth += 1;
  dropzone.classList.add('is-dragover');
});

dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
});

dropzone.addEventListener('dragleave', () => {
  dragDepth = Math.max(0, dragDepth - 1);

  if (dragDepth === 0) {
    dropzone.classList.remove('is-dragover');
  }
});

dropzone.addEventListener('drop', (event) => {
  event.preventDefault();
  dragDepth = 0;
  dropzone.classList.remove('is-dragover');

  if (event.dataTransfer) {
    addFiles(event.dataTransfer.files);
  }
});

window.addEventListener('dragover', (event) => event.preventDefault());
window.addEventListener('drop', (event) => event.preventDefault());

clearButton.addEventListener('click', clearAll);
downloadAllButton.addEventListener('click', () => {
  void downloadAll();
});

syncControls();
