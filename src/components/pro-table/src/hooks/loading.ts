import { ref, computed, watch, SetupContext } from 'vue'

import type { ProTableEmits } from '../props'

interface IProps {
  loading: boolean
}

export const useLoading = (
  props: IProps,
  { emits }: { emits: SetupContext<ProTableEmits>['emit'] }
) => {
  const loading = ref(false)

  const setLoading = (state: boolean) => {
    loading.value = state
    emits('update:loading', loading.value)
  }

  watch(
    () => props.loading,
    (newVal, oldVal) => {
      if (newVal === oldVal) return

      setLoading(props.loading)
    }
  )

  return {
    loading: computed(() => loading.value),
    setLoading
  }
}
