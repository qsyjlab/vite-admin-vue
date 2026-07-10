import { describe, expect, it } from 'vitest'
import { useProRequest } from '../pro-request'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, reject, resolve }
}

describe('useProRequest', () => {
  it('only lets the latest request update state', async () => {
    const first = deferred<string[]>()
    const second = deferred<string[]>()
    const state = useProRequest<string[]>()

    const firstTask = state.execute(() => first.promise, undefined)
    const secondTask = state.execute(() => second.promise, undefined)

    second.resolve(['latest'])
    await secondTask
    expect(state.data.value).toEqual(['latest'])
    expect(state.loading.value).toBe(false)

    first.resolve(['stale'])
    await firstTask
    expect(state.data.value).toEqual(['latest'])
  })

  it('prevents cancelled requests from mutating state', async () => {
    const pending = deferred<string[]>()
    const state = useProRequest<string[]>()
    const task = state.execute(() => pending.promise, undefined)

    state.cancel()
    pending.resolve(['ignored'])
    await task

    expect(state.loading.value).toBe(false)
    expect(state.data.value).toBeUndefined()
  })
})
