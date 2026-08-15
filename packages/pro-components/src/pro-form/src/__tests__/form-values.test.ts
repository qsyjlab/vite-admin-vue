import { describe, expect, it } from 'vitest'
import { transformFormValues } from '../form-values'
import type { FormSchema } from '../types/form'

interface Model {
  name: string
  amount: string | number
}

describe('pro form values', () => {
  it('transforms a cloned submit model without mutating source values', () => {
    const source: Model = { name: '  Project A  ', amount: '12.50' }
    const fields: FormSchema<Model>[] = [
      { key: 'name', transform: value => String(value).trim() },
      { key: 'amount', transform: value => Number(value) }
    ]

    expect(transformFormValues(source, fields)).toEqual({ name: 'Project A', amount: 12.5 })
    expect(source).toEqual({ name: '  Project A  ', amount: '12.50' })
  })
})
