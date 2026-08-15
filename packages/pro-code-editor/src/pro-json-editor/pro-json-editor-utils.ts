import type { ProJsonEditorError, ProJsonValue } from './pro-json-editor'

export function stringifyJsonValue(value: ProJsonValue | undefined, indent = 2, sortKeys = false) {
  if (value === undefined) return ''
  if (typeof value === 'string') return value
  return JSON.stringify(sortKeys ? sortJsonKeys(value) : value, null, indent)
}

export function parseJsonValue(source: string) {
  try {
    return { value: JSON.parse(source) as ProJsonValue, error: undefined }
  } catch (error) {
    return { value: undefined, error: normalizeJsonError(error, source) }
  }
}

export function formatJsonText(source: string, indent = 2, sortKeys = false) {
  const result = parseJsonValue(source)
  if (result.error) return { text: source, ...result }
  return {
    text: JSON.stringify(sortKeys ? sortJsonKeys(result.value) : result.value, null, indent),
    ...result
  }
}

export function minifyJsonText(source: string, sortKeys = false) {
  const result = parseJsonValue(source)
  if (result.error) return { text: source, ...result }
  return {
    text: JSON.stringify(sortKeys ? sortJsonKeys(result.value) : result.value),
    ...result
  }
}

export function normalizeJsonError(error: unknown, source: string): ProJsonEditorError {
  const message = error instanceof Error ? error.message : String(error)
  const positionMatch = message.match(/position\s+(\d+)/i)
  const position = positionMatch ? Number(positionMatch[1]) : undefined
  if (position === undefined) return { message }

  const before = source.slice(0, position)
  const lines = before.split('\n')
  return {
    message,
    position,
    line: lines.length,
    column: (lines.at(-1)?.length ?? 0) + 1
  }
}

function sortJsonKeys(value: ProJsonValue): ProJsonValue {
  if (Array.isArray(value)) return value.map(item => sortJsonKeys(item as ProJsonValue))
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(
    Object.keys(value)
      .sort((left, right) => left.localeCompare(right))
      .map(key => [key, sortJsonKeys((value as Record<string, ProJsonValue>)[key])])
  )
}
