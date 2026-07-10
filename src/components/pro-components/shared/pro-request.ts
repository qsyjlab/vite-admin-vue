import { shallowRef, type ShallowRef } from 'vue'

export interface ProRequestState<TData> {
  data: ShallowRef<TData | undefined>
  error: ShallowRef<unknown>
  loading: ShallowRef<boolean>
  cancel: () => void
  execute: <TParams>(
    request: (params: TParams) => Promise<TData>,
    params: TParams
  ) => Promise<TData>
}

/**
 * Shared async state with latest-request-wins semantics.
 * It does not abort the transport; stale requests are prevented from mutating state.
 */
export function useProRequest<TData>(): ProRequestState<TData> {
  const data = shallowRef<TData>()
  const error = shallowRef<unknown>()
  const loading = shallowRef(false)
  let requestSequence = 0

  function cancel() {
    requestSequence += 1
    loading.value = false
  }

  async function execute<TParams>(
    request: (params: TParams) => Promise<TData>,
    params: TParams
  ): Promise<TData> {
    const currentSequence = ++requestSequence
    loading.value = true
    error.value = undefined

    try {
      const result = await request(params)
      if (currentSequence === requestSequence) data.value = result
      return result
    } catch (reason) {
      if (currentSequence === requestSequence) error.value = reason
      throw reason
    } finally {
      if (currentSequence === requestSequence) loading.value = false
    }
  }

  return { data, error, loading, cancel, execute }
}
