import type { PluginSimple as MarkdownItPlugin } from 'markdown-exit'
import { basename, resolve } from 'node:path'
import process from 'node:process'
import MarkdownItShiki from '@shikijs/markdown-exit'
import Vue from '@vitejs/plugin-vue'
import fs from 'fs-extra'
import matter from 'gray-matter'
import anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'
import MarkdownItMagicLink from 'markdown-it-magic-link'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'
import { VueRouterAutoImports } from 'vue-router/unplugin'
import VueRouter from 'vue-router/vite'
import { SITE } from './scripts/site'
import { slugify } from './scripts/slugify'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  resolve: {
    alias: [
      { find: '~/', replacement: `${resolve(import.meta.dirname, 'src')}/` },
    ],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'dayjs',
    ],
  },
  plugins: [
    UnoCSS(),

    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
      extendRoute(route) {
        const path = route.components.get('default')
        if (!path || !path.endsWith('.md'))
          return

        const { data } = matter(fs.readFileSync(path, 'utf-8'))
        // Drafts are previewable in dev, never published
        if (isProd && data.draft) {
          route.delete()
          return
        }
        route.addToMeta({ frontmatter: data })
      },
    }),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Markdown({
      wrapperComponent: 'WrapperPost',
      wrapperClasses: 'prose m-auto slide-enter-content',
      headEnabled: true,
      exportFrontmatter: false,
      exposeFrontmatter: false,
      exposeExcerpt: false,
      markdownItOptions: {
        quotes: '""\'\'',
      },
      async markdownSetup(md) {
        md.use((await MarkdownItShiki({
          themes: {
            dark: 'vitesse-dark',
            light: 'vitesse-light',
          },
          defaultColor: false,
          cssVariablePrefix: '--s-',
        })) as unknown as MarkdownItPlugin)

        md.use(anchor as unknown as MarkdownItPlugin, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })

        md.use(LinkAttributes as unknown as MarkdownItPlugin, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })

        md.use(MarkdownItMagicLink as unknown as MarkdownItPlugin, {
          linksMap: {
            'Komi Store': { link: 'https://github.com/komi-store/komi-store', imageUrl: '/komi-store.png' },
            'RikkaUi': 'https://github.com/rainxchzed/RikkaUi',
            'RikkaIcons': 'https://github.com/rainxchzed/RikkaIcons',
            'Kotlin Multiplatform': { link: 'https://kotlinlang.org/docs/multiplatform.html', imageUrl: 'https://github.com/JetBrains.png' },
          },
        })
      },
      frontmatterPreprocess(frontmatter, options, id, defaults) {
        if (id.includes('/pages/blog/') && frontmatter.title && !frontmatter.image)
          frontmatter.image = `${SITE.url}/og/${basename(id, '.md')}.png`
        frontmatter.image ||= `${SITE.url}/og.png`
        const head = defaults(frontmatter, options)
        return { head, frontmatter }
      },
    }),

    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        '@vueuse/core',
      ],
    }),

    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align: sub;',
    }),
  ],

  ssgOptions: {
    formatting: 'minify',
    // `/blog/foo/index.html` so both `/blog/foo` and `/blog/foo/` resolve on GitHub Pages
    dirStyle: 'nested',
    includedRoutes(paths) {
      return [
        ...paths.filter(i => !i.includes(':') && !i.includes('*')),
        '/404',
      ]
    },
    // GitHub Pages serves `/404.html` for unknown paths
    htmlFileName: file => file.replace(/\\/g, '/') === '404/index.html' ? '404.html' : undefined,
  },
})
