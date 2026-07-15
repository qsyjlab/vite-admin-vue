import type {
  ProTableFilters,
  ProTableServerState,
  ProTableSorter,
  ProTableUrlState
} from './pro-table'

export type ResolvedProTableUrlState = Required<ProTableUrlState>

export function resolveProTableUrlState(
  config: boolean | ProTableUrlState | undefined
): ResolvedProTableUrlState | undefined {
  if (!config) return undefined
  const value = typeof config === 'object' ? config : {}
  return {
    key: value.key?.trim() || 'table',
    history: value.history ?? 'replace',
    pagination: value.pagination ?? true,
    sorter: value.sorter ?? true,
    filters: value.filters ?? true
  }
}

export function readProTableUrlState(
  search: string,
  config: ResolvedProTableUrlState
): Partial<ProTableServerState> | undefined {
  const params = new URLSearchParams(search)
  const currentKey = getKey(config, 'current')
  const pageSizeKey = getKey(config, 'pageSize')
  const sorterKey = getKey(config, 'sorter')
  const filtersKey = getKey(config, 'filters')
  const hasState = [
    ...(config.pagination ? [currentKey, pageSizeKey] : []),
    ...(config.sorter ? [sorterKey] : []),
    ...(config.filters ? [filtersKey] : [])
  ].some(key => params.has(key))
  if (!hasState) return undefined

  const state: Partial<ProTableServerState> = {}
  if (config.pagination) {
    const current = toPositiveInteger(params.get(currentKey))
    const pageSize = toPositiveInteger(params.get(pageSizeKey))
    if (current) state.current = current
    if (pageSize) state.pageSize = pageSize
  }
  if (config.sorter) {
    const parsedSorter = parseSorter(params.get(sorterKey))
    if (parsedSorter) state.sorter = parsedSorter
  }
  if (config.filters) {
    const parsedFilters = parseFilters(params.get(filtersKey))
    if (parsedFilters) state.filters = parsedFilters
  }
  return Object.keys(state).length ? state : undefined
}

export function writeProTableUrlState(
  search: string,
  state: ProTableServerState,
  config: ResolvedProTableUrlState
): string {
  const params = new URLSearchParams(search)
  if (config.pagination) {
    params.set(getKey(config, 'current'), String(state.current))
    params.set(getKey(config, 'pageSize'), String(state.pageSize))
  }
  if (config.sorter) setJsonValue(params, getKey(config, 'sorter'), state.sorter)
  if (config.filters) {
    const filters = Object.keys(state.filters).length ? state.filters : undefined
    setJsonValue(params, getKey(config, 'filters'), filters)
  }
  const result = params.toString()
  return result ? `?${result}` : ''
}

function getKey(config: ResolvedProTableUrlState, field: string) {
  return `${config.key}.${field}`
}

function toPositiveInteger(value: string | null) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : undefined
}

function parseSorter(value: string | null): ProTableSorter | undefined {
  const parsed = parseJson(value)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined
  const sorter = parsed as Partial<ProTableSorter>
  if (
    typeof sorter.key !== 'string' ||
    (sorter.order !== 'ascending' && sorter.order !== 'descending')
  ) {
    return undefined
  }
  return {
    key: sorter.key,
    field: typeof sorter.field === 'string' ? sorter.field : undefined,
    order: sorter.order
  }
}

function parseFilters(value: string | null): ProTableFilters | undefined {
  const parsed = parseJson(value)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return undefined
  return Object.fromEntries(
    Object.entries(parsed).filter((entry): entry is [string, unknown[]] => Array.isArray(entry[1]))
  )
}

function parseJson(value: string | null): unknown {
  if (!value) return undefined
  try {
    return JSON.parse(value) as unknown
  } catch {
    return undefined
  }
}

function setJsonValue(params: URLSearchParams, key: string, value: unknown) {
  if (value === undefined) params.delete(key)
  else params.set(key, JSON.stringify(value))
}
