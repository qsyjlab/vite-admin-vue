import { describe, expect, it } from 'vitest'
import { isProRequestAbort, useProRequest } from '../pro-request'

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

  it('aborts superseded transports and exposes request phases', async () => {
    const first = deferred<string[]>()
    const second = deferred<string[]>()
    const signals: AbortSignal[] = []
    const state = useProRequest<string[]>()

    const firstTask = state.execute((_, context) => {
      signals.push(context.signal)
      return first.promise
    }, undefined)
    expect(state.initialLoading.value).toBe(true)

    const secondTask = state.execute((_, context) => {
      signals.push(context.signal)
      return second.promise
    }, undefined)
    expect(signals[0].aborted).toBe(true)

    second.resolve(['latest'])
    await secondTask
    first.resolve(['stale'])
    await firstTask
    expect(state.phase.value).toBe('success')
    expect(state.data.value).toEqual(['latest'])
  })

  it('debounces execution and retries failed requests', async () => {
    const state = useProRequest<string[]>({ debounce: 10, retry: 1 })
    let calls = 0

    const result = await state.execute(async (_, context) => {
      calls += 1
      if (context.attempt === 0) throw new Error('temporary')
      return ['recovered']
    }, undefined)

    expect(calls).toBe(2)
    expect(result).toEqual(['recovered'])
    expect(state.error.value).toBeUndefined()
  })

  it('replays the last request through retry', async () => {
    const state = useProRequest<string[]>()
    let failed = true

    await expect(
      state.execute(async () => {
        if (failed) throw new Error('failed')
        return ['ok']
      }, undefined)
    ).rejects.toThrow('failed')

    failed = false
    await expect(state.retry()).resolves.toEqual(['ok'])
    expect(state.action.value).toBe('retry')
  })
})

describe('isProRequestAbort', () => {
  it('recognizes DOM and Axios cancellation errors', () => {
    expect(isProRequestAbort(new DOMException('aborted', 'AbortError'))).toBe(true)
    expect(isProRequestAbort({ name: 'CanceledError' })).toBe(true)
    expect(isProRequestAbort({ code: 'ERR_CANCELED' })).toBe(true)
    expect(isProRequestAbort(new Error('failed'))).toBe(false)
  })
})
