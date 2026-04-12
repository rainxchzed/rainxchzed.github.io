import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (
    await getCollection('blog', ({ data }) => !data.draft)
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'rainxchzed',
    description:
      "Usmon N. — Android and Kotlin Multiplatform developer. Writing about Compose, KMP, and the occasional cat.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? '',
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
