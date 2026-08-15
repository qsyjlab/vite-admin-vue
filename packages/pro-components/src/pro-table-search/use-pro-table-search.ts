import { nextTick, shallowRef, type ShallowRef } from 'vue'
import type { FormModel } from '../pro-form'
import type { ProTableSearchInstance } from './pro-table-search'

export type ProTableSearchTemplateRef<
  TQuery extends FormModel,
  TParams extends object = TQuery
> = Readonly<ShallowRef<ProTableSearchInstance<TQuery, TParams> | null>>

export function useProTableSearch<TQuery extends FormModel, TParams extends object = TQuery>(
  templateRef?: ProTableSearchTemplateRef<TQuery, TParams>
) {
  const searchRef = templateRef ?? shallowRef<ProTableSearchInstance<TQuery, TParams> | null>(null)

  async function getSearch() {
    await nextTick()
    const instance = searchRef.value
    if (!instance) throw new Error('ProTableSearch instance is not available')
    return instance
  }

  return {
    searchRef,
    getSearch,
    async submit() {
      return (await getSearch()).submit()
    },
    async reset() {
      return (await getSearch()).reset()
    },
    async getCollapsed() {
      return (await getSearch()).getCollapsed()
    },
    async setCollapsed(collapsed: boolean) {
      ;(await getSearch()).setCollapsed(collapsed)
    },
    async toggleCollapse() {
      ;(await getSearch()).toggleCollapse()
    },
    async setFieldsValue(values: Partial<TQuery>) {
      await (await getSearch()).setFieldsValue(values)
    },
    async getFieldsValue(transform = true) {
      return (await getSearch()).getFieldsValue(transform)
    }
  }
}
