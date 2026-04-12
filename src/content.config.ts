import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog collection: markdown files under src/content/blog/
// Add a new post by dropping a new `.md` file in that folder.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
