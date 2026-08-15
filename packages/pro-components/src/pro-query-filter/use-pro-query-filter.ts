import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { FormModel } from '../pro-form'
import type { ProQueryFilterInstance } from './pro-query-filter'

export type ProQueryFilterTemplateRef<
  TQuery extends FormModel,
  TParams extends object = TQuery
> = Readonly<ShallowRef<ProQueryFilterInstance<TQuery, TParams> | null>>

export function useProQueryFilter<TQuery extends FormModel, TParams extends object = TQuery>(
  templateRef?: ProQueryFilterTemplateRef<TQuery, TParams>
) {
  const queryFilterRef =
    templateRef ?? shallowRef<ProQueryFilterInstance<TQuery, TParams> | null>(null)

  async function getQueryFilter() {
    await nextTick()
    if (!queryFilterRef.value) throw new Error('ProQueryFilter instance is not available')
    return queryFilterRef.value
  }

  return {
    queryFilterRef,
    getQueryFilter,
    async submit() {
      return (await getQueryFilter()).submit()
    },
    async reset() {
      return (await getQueryFilter()).reset()
    },
    async clear() {
      return (await getQueryFilter()).clear()
    },
    async getActiveCount() {
      return (await getQueryFilter()).getActiveCount()
    },
    async getCollapsed() {
      return (await getQueryFilter()).getCollapsed()
    },
    async setCollapsed(collapsed: boolean) {
      ;(await getQueryFilter()).setCollapsed(collapsed)
    },
    async toggleCollapse() {
      ;(await getQueryFilter()).toggleCollapse()
    },
    async setFieldsValue(values: Partial<TQuery>) {
      await (await getQueryFilter()).setFieldsValue(values)
    },
    async getFieldsValue(transform = true) {
      return (await getQueryFilter()).getFieldsValue(transform)
    }
  }
}
