import { describe, expect, it } from 'vitest'
import type { AxiosRequestConfig } from 'axios'
import { AxiosCanceler } from '../axios-canceler'

describe('AxiosCanceler', () => {
  it('does not cancel a newer request when an older request finishes', () => {
    const canceler = new AxiosCanceler()
    const first: AxiosRequestConfig = { method: 'get', url: '/list' }
    const second: AxiosRequestConfig = { method: 'get', url: '/list' }

    canceler.addPending(first)
    canceler.addPending(second)

    expect(first.signal?.aborted).toBe(true)
    expect(second.signal?.aborted).toBe(false)

    canceler.removePending(first)
    expect(second.signal?.aborted).toBe(false)

    canceler.removePending(second)
    expect(second.signal?.aborted).toBe(false)
  })
})
