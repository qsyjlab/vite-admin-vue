import { getProPathValue } from '../shared/pro-path'
import type { ProTableColumn, ProTableEditableErrors, ProTableEditableRule } from './pro-table'

export function getProTableEditablePath<TRecord extends object>(column: ProTableColumn<TRecord>) {
  return column.dataIndex ?? String(column.key)
}

export function flattenProTableColumns<TRecord extends object>(
  columns: ProTableColumn<TRecord>[]
): ProTableColumn<TRecord>[] {
  return columns.flatMap(column => [column, ...flattenProTableColumns(column.children ?? [])])
}

export async function validateProTableEditableRow<TRecord extends object>(
  row: TRecord,
  columns: ProTableColumn<TRecord>[]
): Promise<ProTableEditableErrors | undefined> {
  const errors: ProTableEditableErrors = {}

  for (const column of flattenProTableColumns(columns)) {
    const rules = column.editableRules ?? column.rowComponent?.rules
    if (!column.editable || !rules?.length) continue
    const path = getProTableEditablePath(column)
    const value = getProPathValue(row, path)

    for (const rule of rules) {
      const message = await validateRule(value, row, rule)
      if (!message) continue
      const key = String(column.key)
      errors[key] = [...(errors[key] ?? []), { message }]
    }
  }

  return Object.keys(errors).length ? errors : undefined
}

async function validateRule<TRecord extends object>(
  value: unknown,
  row: TRecord,
  rule: ProTableEditableRule<TRecord>
) {
  if (rule.required && (value === undefined || value === null || value === '')) {
    return rule.message ?? '此项为必填'
  }
  const validator = rule.validator
  if (!validator) return undefined

  const error = await new Promise<void | boolean | string | Error | undefined>(resolve => {
    let settled = false
    const settle = (result?: void | boolean | string | Error) => {
      if (settled) return
      settled = true
      resolve(result)
    }
    const result = validator(value, row, settle)
    if (result instanceof Promise) void result.then(settle, reason => settle(toError(reason)))
    else if (result !== undefined || validator.length < 3) settle(result)
  })
  if (error === false) return rule.message ?? '校验未通过'
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  return undefined
}

function toError(reason: unknown) {
  return reason instanceof Error ? reason : new Error(String(reason))
}
