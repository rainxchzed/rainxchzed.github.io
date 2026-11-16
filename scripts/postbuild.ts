// Runs after `vite-ssg build`: Open Graph images, RSS feed, sitemap, local fonts.
import { Buffer } from 'node:buffer'
import { basename } from 'node:path'
import fg from 'fast-glob'
import { Feed } from 'feed'
import fs from 'fs-extra'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import satori from 'satori'
import sharp from 'sharp'
import { SITE } from './site'

interface Post {
  slug: string
  title: string
  description?: string
  date: Date
  html: string
}

const DIST = 'dist'

async function getPosts(): Promise<Post[]> {
  const markdown = MarkdownIt({ html: true, linkify: true })
  const files = await fg('pages/blog/*.md')
  const posts = await Promise.all(files.map(async (file) => {
    const { data, content } = matter(await fs.readFile(file, 'utf-8'))
    if (data.draft)
      return
    return {
      slug: basename(file, '.md'),
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      html: markdown.render(content).replaceAll('src="/', `src="${SITE.url}/`),
    }
  }))
  return posts
    .filter((p): p is Post => !!p)
    .sort((a, b) => +b.date - +a.date)
}

async function getFont() {
  // Satori reads TTF/OTF/WOFF, not WOFF2
  const res = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-700-normal.woff')
  if (!res.ok)
    throw new Error(`Failed to fetch Inter for OG images: ${res.status}`)
  return res.arrayBuffer()
}

async function renderOg(font: ArrayBuffer, title: string, output: string) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: '#050505',
          padding: '80px',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: title.length > 40 ? '60px' : '72px',
                fontWeight: 700,
                color: '#e5e5e5',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                maxWidth: '1000px',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '28px',
                color: '#737373',
              },
              children: [
                { type: 'div', props: { children: SITE.author } },
                { type: 'div', props: { children: 'rainxchzed.dev' } },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: font, weight: 700, style: 'normal' }],
    },
  )
  await sharp(Buffer.from(svg)).png().toFile(output)
}

async function buildOg(posts: Post[]) {
  const font = await getFont()
  await fs.ensureDir(`${DIST}/og`)
  await renderOg(font, `${SITE.author}, currently focused on machine learning`, `${DIST}/og.png`)
  await Promise.all(posts.map(p => renderOg(font, p.title, `${DIST}/og/${p.slug}.png`)))
}

async function buildFeed(posts: Post[]) {
  const author = { name: SITE.author, link: SITE.url }
  const feed = new Feed({
    title: SITE.title,
    description: SITE.description,
    id: `${SITE.url}/`,
    link: `${SITE.url}/`,
    language: 'en',
    image: `${SITE.url}/og.png`,
    favicon: `${SITE.url}/favicon.svg`,
    copyright: `2026-PRESENT © ${SITE.author}`,
    feedLinks: { rss: `${SITE.url}/rss.xml` },
    author,
  })
  for (const p of posts) {
    feed.addItem({
      title: p.title,
      // GUIDs stay on the old Astro-era URL so feed readers don't re-list old entries
      id: `${SITE.url}/posts/${p.slug}/`,
      link: `${SITE.url}/blog/${p.slug}/`,
      description: p.description,
      content: p.html,
      date: p.date,
      author: [author],
    })
  }
  await fs.writeFile(`${DIST}/rss.xml`, feed.rss2(), 'utf-8')
}

async function buildSitemap() {
  const pages = (await fg('**/index.html', { cwd: DIST }))
    .filter(i => !i.startsWith('admin/'))
    .map(i => `${SITE.url}/${i.replace(/index\.html$/, '')}`.replace(/\/$/, '') || SITE.url)
    .sort()
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map(loc => `  <url><loc>${loc}</loc></url>`),
    '</urlset>',
  ].join('\n')
  await fs.writeFile(`${DIST}/sitemap.xml`, xml, 'utf-8')
}

// The blog used to live at /posts. GitHub Pages has no server redirects, so write stub pages.
async function buildRedirects(posts: Post[]) {
  const targets = [
    ['posts', '/blog'],
    ...posts.map(p => [`posts/${p.slug}`, `/blog/${p.slug}`]),
  ]
  await Promise.all(targets.map(async ([from, to]) => {
    await fs.ensureDir(`${DIST}/${from}`)
    await fs.writeFile(
      `${DIST}/${from}/index.html`,
      `<!doctype html><meta charset="utf-8"><title>Moved</title><link rel="canonical" href="${SITE.url}${to}"><meta http-equiv="refresh" content="0; url=${to}"><script>location.replace('${to}' + location.hash)</script>`,
      'utf-8',
    )
  }))
}

async function run() {
  const posts = await getPosts()
  // UnoCSS downloads web fonts into public/ during the build, after Vite has copied it
  await fs.copy('public/assets/fonts', `${DIST}/assets/fonts`, { overwrite: true })
  await Promise.all([
    buildOg(posts),
    buildFeed(posts),
    buildSitemap(),
  ])
  // After the sitemap, so the stubs aren't listed in it
  await buildRedirects(posts)
  console.log(`postbuild: ${posts.length} blog entries, feed, sitemap, og images, redirects`)
}

run()
