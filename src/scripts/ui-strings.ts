export type Lang = 'en' | 'id';

const en = {
  statusQueued: 'Queued',
  statusDecode: 'Reading image…',
  statusRender: 'Resampling to 4K…',
  statusEncode: 'Encoding PNG…',
  statusZip: 'Packing ZIP…',
  statusDone: 'Ready',
  statusError: 'Failed',
  errorUnsupported: 'This file is not an image.',
  errorDecode: 'Could not read this image. Try JPG, PNG, or WebP.',
  errorGeneric: 'Something went wrong while processing this image.',
  downloadZip: 'Download ZIP',
  metaQueued: '{size}',
  metaSource: 'Source {source}',
  metaReady: 'Source {source} → 3840×2160 · ZIP {size}',
} as const;

export type MessageKey = keyof typeof en;

const id: Record<MessageKey, string> = {
  statusQueued: 'Menunggu',
  statusDecode: 'Membaca gambar…',
  statusRender: 'Meresampling ke 4K…',
  statusEncode: 'Meng-encode PNG…',
  statusZip: 'Membuat ZIP…',
  statusDone: 'Siap',
  statusError: 'Gagal',
  errorUnsupported: 'File ini bukan gambar.',
  errorDecode: 'Gambar tidak dapat dibaca. Coba JPG, PNG, atau WebP.',
  errorGeneric: 'Terjadi kesalahan saat memproses gambar ini.',
  downloadZip: 'Unduh ZIP',
  metaQueued: '{size}',
  metaSource: 'Sumber {source}',
  metaReady: 'Sumber {source} → 3840×2160 · ZIP {size}',
};

const dictionaries: Record<Lang, Record<MessageKey, string>> = { en, id };

export function getLang(): Lang {
  return document.documentElement.lang.toLowerCase().startsWith('id') ? 'id' : 'en';
}

export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string;

export function getTranslator(lang: Lang): Translate {
  const dictionary = dictionaries[lang];

  return (key, vars) => {
    let message = dictionary[key];

    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        message = message.replaceAll(`{${name}}`, String(value));
      }
    }

    return message;
  };
}
