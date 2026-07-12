import { describe, expect, it } from 'vitest'
import type { FormSchema } from '../types/form'
import {
  createFormCollapsePlan,
  resolveCollapsedRows,
  resolveFormCol,
  type FormCollapsePlanOptions
} from '../use-collapse'

function createFields(...cols: NonNullable<FormSchema['col']>[]): FormSchema[] {
  return cols.map((col, index) => ({ key: `field-${index + 1}`, col }))
}

function createPlan(overrides: Partial<FormCollapsePlanOptions> = {}) {
  return createFormCollapsePlan({
    fields: [],
    collapsed: true,
    collapsedRows: 1,
    collapsible: true,
    hasSubmitter: true,
    submitterCol: { span: 5 },
    viewportWidth: 1200,
    ...overrides
  })
}

describe('pro form collapse layout', () => {
  it('keeps two span-8 fields beside a span-5 submitter in one collapsed row', () => {
    const plan = createPlan({ fields: createFields({ span: 8 }, { span: 8 }, { span: 8 }) })

    expect(plan.canCollapse).toBe(true)
    expect(plan.collapsed).toBe(true)
    expect(plan.fieldVisibilityMap).toEqual({
      'field-1': true,
      'field-2': true,
      'field-3': false
    })
    expect(plan.submitterCol).toMatchObject({ span: 5, offset: 3 })
  })

  it('never hides every field when the first field spans a full row', () => {
    const plan = createPlan({ fields: createFields({ span: 24 }, { span: 8 }) })

    expect(plan.canCollapse).toBe(true)
    expect(plan.fieldVisibilityMap).toEqual({
      'field-1': true,
      'field-2': false
    })
  })

  it('counts an offset when deciding whether the next field wraps', () => {
    const plan = createPlan({
      fields: createFields({ span: 12 }, { span: 8, offset: 5 }),
      collapsed: false,
      hasSubmitter: false
    })

    expect(plan.rowCount).toBe(2)
  })

  it('resolves xs, sm and md values while inheriting responsive object properties', () => {
    const col = {
      span: 24,
      offset: 0,
      xs: 12,
      sm: { span: 8, offset: 2 },
      md: { span: 6 }
    }

    expect(resolveFormCol(col, 500)).toEqual({ span: 12, offset: 0, width: 12 })
    expect(resolveFormCol(col, 800)).toEqual({ span: 8, offset: 2, width: 10 })
    expect(resolveFormCol(col, 1000)).toEqual({ span: 6, offset: 2, width: 8 })
  })

  it('resolves collapsed rows by responsive breakpoint and inherits the nearest value', () => {
    const rows = { xs: 1, sm: 2, md: 3 }

    expect(resolveCollapsedRows(rows, 500)).toBe(1)
    expect(resolveCollapsedRows(rows, 800)).toBe(2)
    expect(resolveCollapsedRows(rows, 1000)).toBe(3)
    expect(resolveCollapsedRows(rows, 1300)).toBe(3)
  })

  it('lets later fields fill the space left by a dynamically hidden field', () => {
    const plan = createPlan({
      fields: createFields({ span: 8 }, { span: 8 }, { span: 8 }, { span: 8 }),
      fieldVisibilityMap: { 'field-1': false }
    })

    expect(plan.fieldVisibilityMap).toEqual({
      'field-1': false,
      'field-2': true,
      'field-3': true,
      'field-4': false
    })
  })

  it('treats a span-0 field as hidden without consuming collapsed space', () => {
    const plan = createPlan({
      fields: createFields({ span: 0 }, { span: 8 }, { span: 8 }, { span: 8 })
    })

    expect(plan.fieldVisibilityMap).toEqual({
      'field-1': false,
      'field-2': true,
      'field-3': true,
      'field-4': false
    })
  })

  it('keeps every layout-visible field rendered while expanded', () => {
    const plan = createPlan({
      fields: createFields({ span: 8 }, { span: 8 }, { span: 8 }),
      collapsed: false
    })

    expect(plan.canCollapse).toBe(true)
    expect(plan.collapsed).toBe(false)
    expect(plan.fieldVisibilityMap).toEqual({
      'field-1': true,
      'field-2': true,
      'field-3': true
    })
  })
})
