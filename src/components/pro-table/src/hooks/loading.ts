import { ref, computed } from 'vue'

export const useLoading = () => {
  const loading = ref(false)

  const setLoading = (state: boolean) => {
    loading.value = state
  }

  return {
    loading: computed(() => loading.value),
    setLoading
  }
}
