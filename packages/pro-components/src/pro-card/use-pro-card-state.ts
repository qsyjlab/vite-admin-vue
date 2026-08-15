import { computed, ref } from 'vue'

export interface UseProCardStateOptions {
  collapsed: () => boolean | undefined
  defaultCollapsed: boolean
  onChange: (collapsed: boolean) => void
}

export function useProCardState(options: UseProCardStateOptions) {
  const internalCollapsed = ref(options.defaultCollapsed)
  const effectiveCollapsed = computed(() => options.collapsed() ?? internalCollapsed.value)

  function setCollapsed(collapsed: boolean) {
    if (options.collapsed() === undefined) internalCollapsed.value = collapsed
    options.onChange(collapsed)
  }

  function toggleCollapse() {
    setCollapsed(!effectiveCollapsed.value)
  }

  return {
    effectiveCollapsed,
    setCollapsed,
    toggleCollapse
  }
}
