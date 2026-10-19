// Generated at dev/build time by vite/siteMapPlugin.ts from AppRouter and its imports.
declare module 'virtual:site-map' {
  export interface SiteMapRoute {
    path: string
    component: string
    file: string | null
    nestedUnder: string | null
  }

  export interface SiteMapLink {
    from: string
    to: string
    file: string
    line: number
    dynamic: boolean
  }

  const siteMap: { routes: SiteMapRoute[]; links: SiteMapLink[] }
  export default siteMap
}
