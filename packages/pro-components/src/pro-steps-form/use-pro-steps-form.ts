import { nextTick, type Ref } from 'vue'
import type { FormModel } from '../pro-form'
import type { ProStepsFormExpose } from './pro-steps-form'

export function useProStepsForm<TModel extends FormModel, TResult = unknown>(
  stepsRef: Readonly<Ref<ProStepsFormExpose<TModel, TResult> | null>>
) {
  async function getStepsForm() {
    await nextTick()
    if (!stepsRef.value) throw Error('The steps form instance is not available')
    return stepsRef.value
  }

  return {
    next: async () => (await getStepsForm()).next(),
    previous: async () => (await getStepsForm()).previous(),
    goTo: async (index: number) => (await getStepsForm()).goTo(index),
    submit: async () => (await getStepsForm()).submit(),
    reset: async () => (await getStepsForm()).reset(),
    getValues: async () => (await getStepsForm()).getValues(),
    getStepsForm
  }
}
