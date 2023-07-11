import { useAppProviderContext } from './context'
import { computed, unref } from 'vue'

export function useAppInject() {
  const values = useAppProviderContext()

  return {
    isMobile: computed(() => unref(values.isMobile))
  }
}
