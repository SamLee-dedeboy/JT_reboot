// The dashboard used hash routes (#/flow). On the site it lives under one
// React Router prefix; views navigate with these helpers instead of `push`.
export const CO_DESIGN_BASE = '/pages/co-design-dashboard'

export const coDesignPath = (view = '/') =>
  view === '/' ? CO_DESIGN_BASE : `${CO_DESIGN_BASE}${view.startsWith('/') ? view : `/${view}`}`
