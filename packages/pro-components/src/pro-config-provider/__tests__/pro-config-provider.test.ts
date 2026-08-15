import { describe, expect, it } from 'vitest'
import { computed, reactive } from 'vue'
import { mergeProConfig } from '../pro-config-provider-context'
import { resolveProConfigProviderPopperClass } from '../pro-config-provider-utils'

describe('mergeProConfig', () => {
  it('merges nested field and table config with local values taking priority', () => {
    const parentRenderer = { read: { name: 'ParentRenderer' } }
    const localRenderer = { read: { name: 'LocalRenderer' } }
    const parentAdapter = () => ({ data: [], total: 0 })

    const result = mergeProConfig(
      {
        field: { emptyText: 'N/A', renderers: { parent: parentRenderer } },
        table: { responseAdapter: parentAdapter, options: false }
      },
      {
        field: { emptyText: '-', renderers: { local: localRenderer } },
        table: { options: { reload: true } }
      }
    )

    expect(result.field?.emptyText).toBe('-')
    expect(result.field?.renderers).toEqual({ parent: parentRenderer, local: localRenderer })
    expect(result.table?.responseAdapter).toBe(parentAdapter)
    expect(result.table?.options).toEqual({ reload: true })
  })

  it('merges provider defaults and theme variables without undefined overrides', () => {
    const result = mergeProConfig(
      {
        size: 'small',
        dark: true,
        theme: { className: 'parent', variables: { '--brand': '#111', '--space': 8 } },
        card: { bordered: true, shadow: 'never' }
      },
      {
        size: undefined,
        theme: { className: 'local', variables: { '--brand': '#222' } },
        card: { shadow: 'hover' }
      }
    )

    expect(result.size).toBe('small')
    expect(result.dark).toBe(true)
    expect(result.theme).toEqual({
      className: 'local',
      variables: { '--brand': '#222', '--space': 8 }
    })
    expect(result.card).toEqual({ bordered: true, shadow: 'hover' })
  })

  it('reacts to nested provider updates at runtime', () => {
    const parent = reactive<{
      size: 'small' | 'default'
      dark: boolean
    }>({ size: 'default', dark: false })
    const local = reactive({ dark: true, card: { bordered: false } })
    const merged = computed(() => mergeProConfig(parent, local))

    expect(merged.value).toMatchObject({ size: 'default', dark: true })
    expect(merged.value.card).toEqual({ bordered: false })

    parent.size = 'small'
    local.dark = false
    expect(merged.value).toMatchObject({ size: 'small', dark: false })
  })

  it('preserves custom popper classes while adding the local dark scope', () => {
    expect(resolveProConfigProviderPopperClass(true, 'project-popper')).toBe(
      'project-popper pro-config-provider-popper--dark'
    )
    expect(resolveProConfigProviderPopperClass(false, 'project-popper')).toBe('project-popper')
  })
})
