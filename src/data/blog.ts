import type { Lang } from './types';

export interface BlogCopy {
  seoTitle: string;
  seoDescription: string;
  skipLabel: string;
  title: string;
  empty: string;
  readMore: string;
  published: string;
  backToBlog: string;
  backToTool: string;
}

export const blogCopy: Record<Lang, BlogCopy> = {
  en: {
    seoTitle: 'Blog — zip4k',
    seoDescription:
      'Notes on preparing 4K landscape images, center-cropping, and packaging uploads for stock platforms.',
    skipLabel: 'Skip to content',
    title: 'Blog',
    empty: 'No posts yet. New notes will appear here.',
    readMore: 'Read article',
    published: 'Published',
    backToBlog: 'All articles',
    backToTool: 'Back to the tool',
  },
  id: {
    seoTitle: 'Blog — zip4k',
    seoDescription:
      'Catatan tentang menyiapkan gambar landscape 4K, memotong tengah, dan mengemas unggahan untuk platform stok.',
    skipLabel: 'Lewati ke konten',
    title: 'Blog',
    empty: 'Belum ada artikel. Tulisan baru akan muncul di sini.',
    readMore: 'Baca artikel',
    published: 'Terbit',
    backToBlog: 'Semua artikel',
    backToTool: 'Kembali ke alat',
  },
};
