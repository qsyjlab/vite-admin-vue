import { nextTick, type Ref } from 'vue'
import type { FormModel } from '../pro-form'
import type { ProModalFormExpose } from './pro-modal-form'

export function useProModalForm<TModel extends FormModel, TResult = unknown>(
  modalRef: Readonly<Ref<ProModalFormExpose<TModel, TResult> | null>>
) {
  async function getModal() {
    await nextTick()
    if (!modalRef.value) throw Error('The modal form instance is not available')
    return modalRef.value
  }

  return {
    open: async (options?: Parameters<ProModalFormExpose<TModel, TResult>['open']>[0]) =>
      (await getModal()).open(options),
    close: async () => (await getModal()).close(),
    submit: async () => (await getModal()).submit(),
    reset: async () => (await getModal()).reset(),
    getModal
  }
}
