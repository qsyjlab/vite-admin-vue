import { computed, inject, type InjectionKey } from 'vue'
import type {
  ProConfigProviderContext,
  ProConfigProviderProps,
  ProConfigProviderThemeConfig
} from './pro-config-provider'

export const proConfigProviderContextKey: InjectionKey<ProConfigProviderContext> =
  Symbol('pro-config-provider')

export function mergeProConfig(
  parent: ProConfigProviderProps,
  current: ProConfigProviderProps
): ProConfigProviderProps {
  const definedCurrent = Object.fromEntries(
    Object.entries(current).filter(([, value]) => value !== undefined)
  ) as ProConfigProviderProps

  return {
    ...parent,
    ...definedCurrent,
    theme: mergeSection(parent.theme, current.theme, true),
    field: {
      ...parent.field,
      ...current.field,
      renderers: {
        ...parent.field?.renderers,
        ...current.field?.renderers
      }
    },
    form: mergeSection(parent.form, current.form),
    table: mergeSection(parent.table, current.table),
    descriptions: mergeSection(parent.descriptions, current.descriptions),
    card: mergeSection(parent.card, current.card),
    list: mergeSection(parent.list, current.list)
  }
}

function mergeSection<T extends object>(parent?: T, current?: T, mergeVariables = false) {
  if (!parent && !current) return undefined
  const merged = { ...parent, ...current }
  if (mergeVariables) {
    return {
      ...merged,
      variables: {
        ...(parent as ProConfigProviderThemeConfig | undefined)?.variables,
        ...(current as ProConfigProviderThemeConfig | undefined)?.variables
      }
    } as T
  }
  return merged
}

export function useProConfigProvider() {
  const context = inject(proConfigProviderContextKey, undefined)
  return context ?? computed<ProConfigProviderProps>(() => ({}))
}
