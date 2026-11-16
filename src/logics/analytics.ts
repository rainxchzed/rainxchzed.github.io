import type { Router } from 'vue-router'

// GoatCounter: cookie-free, no consent banner needed.
// The script counts the first page view itself; client-side navigations are counted here.
export function setupAnalytics(router: Router) {
  const script = document.createElement('script')
  script.async = true
  script.src = '//gc.zgo.at/count.js'
  script.dataset.goatcounter = 'https://rainxchzed.goatcounter.com/count'
  document.head.appendChild(script)

  router.afterEach((to, from) => {
    if (from.matched.length && to.path !== from.path)
      window.goatcounter?.count({ path: to.fullPath })
  })
}
