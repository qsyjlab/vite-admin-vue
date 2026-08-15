import { nextTick, type Ref } from 'vue'
import type { FormModel } from '../pro-form'
import type { ProDrawerFormExpose } from './pro-drawer-form'

export function useProDrawerForm<TModel extends FormModel, TResult = unknown>(
  drawerRef: Readonly<Ref<ProDrawerFormExpose<TModel, TResult> | null>>
) {
  async function getDrawer() {
    await nextTick()
    if (!drawerRef.value) throw Error('The drawer form instance is not available')
    return drawerRef.value
  }

  return {
    open: async (options?: Parameters<ProDrawerFormExpose<TModel, TResult>['open']>[0]) =>
      (await getDrawer()).open(options),
    close: async () => (await getDrawer()).close(),
    submit: async () => (await getDrawer()).submit(),
    reset: async () => (await getDrawer()).reset(),
    getDrawer
  }
}
