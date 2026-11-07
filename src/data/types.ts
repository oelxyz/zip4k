export type Lang = 'en' | 'id';

export interface SeoContent {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogLocale: string;
  ogLocaleAlternate: string;
  browserRequirements: string;
}

export interface MastheadContent {
  homeLabel: string;
  note: string;
  blogHref: string;
  blogLabel: string;
  languageLabel: string;
  themeLabel: string;
}

export interface HeroContent {
  kicker: string;
  headlines: [string, string];
  lede: string;
  tags: string[];
  demoLabel: string;
  demoStatus: string;
  demoCopy: string;
}

// kept for existing lookup types/indexing


export interface ToolContent {
  sectionNo: string;
  title: string;
  dropTitle: string;
  dropHint: string;
  queueLabel: string;
  downloadAll: string;
  clear: string;
  empty: string;
  memoryNote: string;
  finishLabel: string;
  finishHint: string;
  finishNatural: string;
  finishCrisp: string;
}

export interface StepItem {
  title: string;
  body: string;
}

export interface SpecRow {
  label: string;
  html: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FooterContent {
  note: string;
  openSourcePrefix: string;
  githubRepoHref: string;
  githubRepoLabel: string;
  openSourceSeparator: string;
  githubProfileHref: string;
  githubProfileLabel: string;
  credit: string;
  meta: string[];
}

export interface HomeContent {
  lang: Lang;
  path: string;
  skipLabel: string;
  seo: SeoContent;
  masthead: MastheadContent;
  hero: HeroContent;
  tool: ToolContent;
  how: {
    sectionNo: string;
    title: string;
    steps: StepItem[];
  };
  spec: {
    sectionNo: string;
    title: string;
    rows: SpecRow[];
  };
  faq: {
    sectionNo: string;
    title: string;
    items: FaqItem[];
  };
  quality: {
    sectionNo: string;
    title: string;
    body: string;
  };
  footer: FooterContent;
}
