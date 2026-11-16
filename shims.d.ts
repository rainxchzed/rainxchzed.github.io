import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    frontmatter: any
  }
}

declare global {
  interface Window {
    goatcounter?: { count: (vars?: { path?: string }) => void }
  }
}
