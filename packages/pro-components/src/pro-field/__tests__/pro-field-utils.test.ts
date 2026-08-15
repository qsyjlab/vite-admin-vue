import { describe, expect, it } from 'vitest'
import {
  formatProFieldValue,
  getProFieldEnumItem,
  proFieldEnumToOptions,
  resolveProFieldValueType
} from '../pro-field-utils'

describe('pro field utils', () => {
  it('normalizes value type configurations', () => {
    expect(resolveProFieldValueType('money')).toEqual({ type: 'money' })
    expect(resolveProFieldValueType({ type: 'money', currency: 'USD' })).toEqual({
      type: 'money',
      currency: 'USD'
    })
  })

  it('resolves enum items and editor options', () => {
    const valueEnum = {
      pending: { text: '待处理', type: 'warning' as const },
      done: '已完成'
    }

    expect(getProFieldEnumItem(valueEnum, 'pending')).toEqual({
      text: '待处理',
      type: 'warning'
    })
    expect(proFieldEnumToOptions(valueEnum)).toEqual([
      { label: '待处理', value: 'pending', disabled: undefined },
      { label: '已完成', value: 'done', disabled: undefined }
    ])
  })

  it('formats money, percent, date and option labels', () => {
    expect(
      formatProFieldValue(1280, {
        type: 'money',
        currency: 'CNY',
        locale: 'zh-CN'
      })
    ).toContain('1,280.00')
    expect(formatProFieldValue(35, { type: 'percent' })).toBe('35%')
    expect(formatProFieldValue('2026-07-11', { type: 'date' })).toBe('2026-07-11')
    expect(
      formatProFieldValue(['vue', 'typescript'], { type: 'checkbox' }, [
        { label: 'Vue', value: 'vue', disabled: false },
        { label: 'TypeScript', value: 'typescript', disabled: false }
      ])
    ).toBe('Vue / TypeScript')
  })

  it('formats upload file names in read mode', () => {
    expect(
      formatProFieldValue(
        [{ name: 'contract.pdf' }, { name: 'budget.xlsx' }],
        resolveProFieldValueType('upload')
      )
    ).toBe('contract.pdf / budget.xlsx')
  })
})
