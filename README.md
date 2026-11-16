**[rainxchzed.dev](https://rainxchzed.dev)**

personal site of Usmon, a 17-year-old developer focused on machine learning

## about

I'm Usmon, a 17-year-old developer currently focused on machine learning. Before that, I built Android and Kotlin Multiplatform apps, including [Komi Store](https://github.com/komi-store/komi-store) (a cross-platform app store for releases on GitHub, Codeberg and other forges) and [RikkaUi](https://github.com/rainxchzed/RikkaUi) (a shadcn-for-Compose design system).

## stack

Built on [Anthony Fu](https://github.com/antfu)'s toolchain, following the design of [antfu.me](https://antfu.me):

|          |                                                                                                                                                |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| app      | [Vue](https://vuejs.org) + [Vite](https://vite.dev), prerendered with [vite-ssg](https://github.com/antfu-collective/vite-ssg)                 |
| styling  | [UnoCSS](https://unocss.dev) with attributify mode and [Iconify](https://icones.js.org) icons                                                    |
| content  | Markdown pages via [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown), code highlighting by [Shiki](https://shiki.style) |
| utils    | [VueUse](https://vueuse.org), file-based routing from `vue-router`                                                                             |
| lint     | [@antfu/eslint-config](https://github.com/antfu/eslint-config)                                                                                 |
| comments | [giscus](https://giscus.app) on GitHub Discussions                                                                                             |
| hosting  | GitHub Pages                                                                                                                                   |

## writing

Blog entries are Markdown files in [`pages/blog/`](./pages/blog). Frontmatter takes `title`, `date`, and optional `description`, `tags`, and `draft`. Drafts render in dev but are left out of the build. They can also be written through the Decap CMS editor at `/admin`.

## run it locally

```bash
pnpm install
pnpm dev     # → http://localhost:3333
pnpm build   # → dist/
```

## credits

Design and parts of the code (prose styles, plum background, theme transition) are adapted from [antfu.me](https://github.com/antfu/antfu.me), MIT licensed.
