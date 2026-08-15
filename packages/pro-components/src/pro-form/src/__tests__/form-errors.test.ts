import { describe, expect, it } from 'vitest'
import { normalizeFormFieldErrors } from '../form-errors'

describe('pro form errors', () => {
  it('normalizes a service error map into field errors', () => {
    expect(
      normalizeFormFieldErrors({
        customer: '客户不存在',
        'invoice.taxNumber': ['税号格式错误', '税号已占用']
      })
    ).toEqual([
      { name: 'customer', errors: '客户不存在' },
      { name: 'invoice.taxNumber', errors: ['税号格式错误', '税号已占用'] }
    ])
  })

  it('keeps an existing field error list unchanged', () => {
    const errors = [{ name: 'name' as const, errors: '名称不能为空' }]

    expect(normalizeFormFieldErrors(errors)).toBe(errors)
  })
})
