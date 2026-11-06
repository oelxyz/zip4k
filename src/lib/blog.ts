import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../data/types';

export type BlogPost = CollectionEntry<'blog'>;

export function postSlug(post: BlogPost): string {
  return post.id.replace(/^(en|id)\//, '');
}

export async function getPublishedPosts(lang: Lang): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => data.lang === lang && !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function findTranslation(post: BlogPost, lang: Lang): Promise<BlogPost | undefined> {
  const slug = postSlug(post);
  const posts = await getCollection(
    'blog',
    ({ data, id }) => data.lang === lang && !data.draft && id === `${lang}/${slug}`,
  );

  return posts[0];
}
