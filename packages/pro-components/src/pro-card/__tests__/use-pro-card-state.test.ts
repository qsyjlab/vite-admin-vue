import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useProCardState } from '../use-pro-card-state'

describe('useProCardState', () => {
  it('updates internal state in uncontrolled mode', () => {
    const controlled = ref<boolean>()
    const onChange = vi.fn()
    const state = useProCardState({
      collapsed: () => controlled.value,
      defaultCollapsed: false,
      onChange
    })

    state.toggleCollapse()

    expect(state.effectiveCollapsed.value).toBe(true)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('emits changes without mutating controlled state', () => {
    const controlled = ref(false)
    const onChange = vi.fn()
    const state = useProCardState({
      collapsed: () => controlled.value,
      defaultCollapsed: true,
      onChange
    })

    state.setCollapsed(true)
    expect(state.effectiveCollapsed.value).toBe(false)
    expect(onChange).toHaveBeenCalledWith(true)

    controlled.value = true
    expect(state.effectiveCollapsed.value).toBe(true)
  })
})
