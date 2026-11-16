import { ViteSSG } from 'vite-ssg'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { setupAnalytics } from './logics/analytics'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import './styles/prose.css'
import './styles/markdown.css'
import 'uno.css'

export const createApp = ViteSSG(
  App,
  {
    routes: [
      ...routes,
      // The blog used to live at /posts (static redirect pages are written by scripts/postbuild.ts)
      { path: '/posts/:slug?', redirect: to => ({ path: `/blog/${to.params.slug || ''}`.replace(/\/$/, ''), hash: to.hash }) },
    ],
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition)
        return savedPosition
      if (to.hash)
        return { el: decodeURIComponent(to.hash), top: 40 }
      return { top: 0 }
    },
  },
  ({ router }) => {
    if (!import.meta.env.SSR && import.meta.env.PROD)
      setupAnalytics(router)
  },
)
