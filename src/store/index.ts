import { useAppStore, useRouteStore, useUserStore } from './module'

export const useStore = () => {
  return {
    appStore: useAppStore(),
    routeStore: useRouteStore(),
    userStore: useUserStore()
  }
}

export * from './module'
export { useStore as default }
