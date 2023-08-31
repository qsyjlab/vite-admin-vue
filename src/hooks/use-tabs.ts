import { useTabPageStore } from '@/store'

export function useTabs() {
  const { getTabPages, updateTabPage } = useTabPageStore()

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
