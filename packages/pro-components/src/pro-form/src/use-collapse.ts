import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref
} from 'vue'
import type { ColProps } from 'element-plus'
import type { FormBreakpoint, FormModel, FormSchema, ProFormCollapsedRows } from './types/form'

const GRID_COLUMNS = 24
const BREAKPOINT_MIN_WIDTH: Record<Exclude<FormBreakpoint, 'xs'>, number> = {
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1920
}

interface ResolvedCol {
  span: number
  offset: number
  width: number
}

interface FormLayoutItem {
  key: string
  col: ResolvedCol
}

export interface FormCollapsePlanOptions<TModel extends FormModel = FormModel> {
  fields: FormSchema<TModel>[]
  collapsed: boolean
  collapsedRows: ProFormCollapsedRows
  collapsible: boolean
  hasSubmitter: boolean
  submitterCol?: Partial<ColProps>
  fieldVisibilityMap?: Record<string, boolean>
  viewportWidth: number
}

export interface FormCollapsePlan {
  canCollapse: boolean
  collapsed: boolean
  fieldVisibilityMap: Record<string, boolean>
  rowCount: number
  collapsedRowCount: number
  submitterCol: Partial<ColProps>
}

interface CollapseOption<TModel extends FormModel = FormModel> {
  fields: ComputedRef<FormSchema<TModel>[]>
  collapsed: Ref<boolean>
  collapsedRows: MaybeRefOrGetter<ProFormCollapsedRows>
  collapsible: MaybeRefOrGetter<boolean>
  hasSubmitter: MaybeRefOrGetter<boolean>
  submitterCol: MaybeRefOrGetter<Partial<ColProps> | undefined>
  fieldVisibilityMap?: Record<string, boolean>
  viewportWidth?: Ref<number>
}

export function getFormBreakpoint(width: number): FormBreakpoint {
  if (width >= BREAKPOINT_MIN_WIDTH.xl) return 'xl'
  if (width >= BREAKPOINT_MIN_WIDTH.lg) return 'lg'
  if (width >= BREAKPOINT_MIN_WIDTH.md) return 'md'
  if (width >= BREAKPOINT_MIN_WIDTH.sm) return 'sm'
  return 'xs'
}

export function resolveCollapsedRows(value: ProFormCollapsedRows, width: number) {
  if (typeof value === 'number') return normalizeRows(value)

  const breakpoint = getFormBreakpoint(width)
  const candidates: FormBreakpoint[] = ['xs']
  if (breakpoint !== 'xs') candidates.push('sm')
  if (breakpoint === 'md' || breakpoint === 'lg' || breakpoint === 'xl') candidates.push('md')
  if (breakpoint === 'lg' || breakpoint === 'xl') candidates.push('lg')
  if (breakpoint === 'xl') candidates.push('xl')

  let rows = value.xs
  candidates.forEach(key => {
    if (value[key] !== undefined) rows = value[key]
  })
  return normalizeRows(rows ?? 1)
}

export function resolveFormCol(
  col: Partial<ColProps> | undefined,
  viewportWidth: number,
  defaultSpan = GRID_COLUMNS
): ResolvedCol {
  let span = col?.span ?? defaultSpan
  let offset = col?.offset ?? 0
  const breakpoint = getFormBreakpoint(viewportWidth)
  const responsiveValues = getActiveResponsiveValues(col, breakpoint)

  responsiveValues.forEach(value => {
    if (typeof value === 'number') {
      span = value
      return
    }
    if (value?.span !== undefined) span = value.span
    if (value?.offset !== undefined) offset = value.offset
  })

  span = normalizeGridValue(span)
  offset = normalizeGridValue(offset)
  return {
    span,
    offset,
    width: Math.min(GRID_COLUMNS, span + offset)
  }
}

export function createFormCollapsePlan<TModel extends FormModel>(
  options: FormCollapsePlanOptions<TModel>
): FormCollapsePlan {
  const visibility = options.fieldVisibilityMap ?? {}
  const fieldVisibilityMap: Record<string, boolean> = {}
  const items = options.fields.reduce<FormLayoutItem[]>((result, field) => {
    const key = String(field.key)
    if (visibility[key] === false) {
      fieldVisibilityMap[key] = false
      return result
    }

    const col = resolveFormCol(field.col, options.viewportWidth)
    if (col.span === 0) {
      fieldVisibilityMap[key] = false
      return result
    }

    fieldVisibilityMap[key] = true
    result.push({ key, col })
    return result
  }, [])
  const submitterCol = resolveFormCol(
    options.submitterCol,
    options.viewportWidth,
    options.hasSubmitter ? 6 : 0
  )
  const submitterSpan = options.hasSubmitter ? Math.max(1, submitterCol.span) : 0
  const maxCollapsedRows = resolveCollapsedRows(options.collapsedRows, options.viewportWidth)
  const collapsedFieldCount = getCollapsedFieldCount(items, submitterSpan, maxCollapsedRows)
  const canCollapse = options.collapsible && collapsedFieldCount < items.length
  const collapsed = options.collapsed && canCollapse
  const renderedItems = collapsed ? items.slice(0, collapsedFieldCount) : items

  if (collapsed) {
    items.slice(collapsedFieldCount).forEach(item => {
      fieldVisibilityMap[item.key] = false
    })
  }

  const expandedPlacement = getSubmitterPlacement(items, submitterSpan)
  const renderedPlacement = getSubmitterPlacement(renderedItems, submitterSpan)

  return {
    canCollapse,
    collapsed,
    fieldVisibilityMap,
    rowCount: expandedPlacement.rowCount,
    collapsedRowCount: renderedPlacement.rowCount,
    submitterCol: {
      ...(options.submitterCol?.tag ? { tag: options.submitterCol.tag } : {}),
      span: submitterSpan || GRID_COLUMNS,
      offset: renderedPlacement.offset
    }
  }
}

export function useCollapse<TModel extends FormModel>(option: CollapseOption<TModel>) {
  const viewportWidth = option.viewportWidth ?? useViewportWidth()
  const plan = computed(() =>
    createFormCollapsePlan({
      fields: option.fields.value,
      collapsed: option.collapsed.value,
      collapsedRows: toValue(option.collapsedRows),
      collapsible: toValue(option.collapsible),
      hasSubmitter: toValue(option.hasSubmitter),
      submitterCol: toValue(option.submitterCol),
      fieldVisibilityMap: option.fieldVisibilityMap,
      viewportWidth: viewportWidth.value
    })
  )

  const setCollapsed = (value: boolean) => {
    option.collapsed.value = value
  }

  const toggleCollapse = () => setCollapsed(!option.collapsed.value)

  return {
    canCollapse: computed(() => plan.value.canCollapse),
    collapsed: computed(() => plan.value.collapsed),
    fieldsIsCollapsedMap: computed(() => plan.value.fieldVisibilityMap),
    rowCount: computed(() => plan.value.rowCount),
    submitterColAttrs: computed(() => plan.value.submitterCol),
    setCollapsed,
    toggleCollapse
  }
}

function getActiveResponsiveValues(col: Partial<ColProps> | undefined, breakpoint: FormBreakpoint) {
  if (!col) return []
  if (breakpoint === 'xs') return [col.xs]

  const values = [col.sm]
  if (breakpoint === 'md' || breakpoint === 'lg' || breakpoint === 'xl') values.push(col.md)
  if (breakpoint === 'lg' || breakpoint === 'xl') values.push(col.lg)
  if (breakpoint === 'xl') values.push(col.xl)
  return values
}

function getCollapsedFieldCount(items: FormLayoutItem[], submitterSpan: number, maxRows: number) {
  let count = 0
  for (let index = 1; index <= items.length; index += 1) {
    if (getSubmitterPlacement(items.slice(0, index), submitterSpan).rowCount > maxRows) break
    count = index
  }

  return count === 0 && items.length > 0 ? 1 : count
}

function getSubmitterPlacement(items: FormLayoutItem[], submitterSpan: number) {
  const fieldLayout = getFieldLayout(items)
  if (submitterSpan === 0) return { rowCount: fieldLayout.rowCount, offset: 0 }

  if (fieldLayout.usedSpan + submitterSpan <= GRID_COLUMNS) {
    return {
      rowCount: Math.max(1, fieldLayout.rowCount),
      offset: GRID_COLUMNS - fieldLayout.usedSpan - submitterSpan
    }
  }

  return {
    rowCount: fieldLayout.rowCount + 1,
    offset: GRID_COLUMNS - submitterSpan
  }
}

function getFieldLayout(items: FormLayoutItem[]) {
  let rowCount = 0
  let usedSpan = 0

  items.forEach(item => {
    if (rowCount === 0) rowCount = 1
    if (usedSpan > 0 && usedSpan + item.col.width > GRID_COLUMNS) {
      rowCount += 1
      usedSpan = 0
    }
    usedSpan += item.col.width
  })

  return { rowCount, usedSpan }
}

function useViewportWidth() {
  const width = ref(typeof window === 'undefined' ? BREAKPOINT_MIN_WIDTH.lg : window.innerWidth)
  const update = () => {
    width.value = window.innerWidth
  }

  if (getCurrentInstance()) {
    onMounted(() => window.addEventListener('resize', update, { passive: true }))
    onBeforeUnmount(() => window.removeEventListener('resize', update))
  }
  return width
}

function normalizeGridValue(value: number) {
  return Math.min(GRID_COLUMNS, Math.max(0, Number.isFinite(value) ? value : 0))
}

function normalizeRows(value: number) {
  return Math.max(1, Math.floor(Number.isFinite(value) ? value : 1))
}
