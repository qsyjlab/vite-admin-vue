import { describe, expect, it } from 'vitest'
import type { FormFieldDependencyContext } from '../types/form'
import { getFormDependencyKey, resolveFormDynamicValue } from '../form-dependency'

const context: FormFieldDependencyContext<{ enabled: boolean; profile: { type: string } }> = {
  name: 'profile.type',
  value: 'company',
  values: { enabled: true, profile: { type: 'company' } },
  dependencies: { enabled: true },
  dependencyValues: [true],
  getFieldValue: () => undefined
}

describe('pro form field dependencies', () => {
  it('normalizes dependency paths into stable keys', () => {
    expect(getFormDependencyKey('profile.type')).toBe('profile.type')
    expect(getFormDependencyKey(['items', 0, 'name'])).toBe('items.0.name')
  })

  it('resolves context-based dynamic values', () => {
    expect(
      resolveFormDynamicValue(
        ({ dependencies }) => Boolean(dependencies.enabled),
        context,
        true,
        false
      )
    ).toBe(true)
  })

  it('supports value and values resolver parameters', () => {
    expect(
      resolveFormDynamicValue(
        (value, values) => value === 'company' && values.enabled,
        context,
        false,
        false
      )
    ).toBe(true)
  })

  it('supports single-argument resolvers when dependencies are not declared', () => {
    expect(resolveFormDynamicValue(value => value === 'company', context, false, false)).toBe(true)
  })
})
