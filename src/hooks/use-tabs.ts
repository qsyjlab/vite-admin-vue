import { useTabPageStore } from '@/store'

export function useTabs() {
  const { updateTabPage } = useTabPageStore()

  function setTitle(title: string) {
    updateTabPage({
      meta: {
        title
      }
    })
  }

  return {
    setTitle
  }
}
