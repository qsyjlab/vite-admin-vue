import type { ComponentSize } from 'element-plus'
import type { Ref, VNodeChild } from 'vue'
import type { ProFieldRendererDefinition } from '../pro-field'
import type { ProListRequestResult } from '../pro-list'
import type { ProDescriptionsProps } from '../pro-descriptions'
import type { ProTableOptions, ProTableRequestResult } from '../pro-table'

export interface ProConfigProviderFieldConfig {
  emptyText?: string
  renderers?: Record<string, ProFieldRendererDefinition>
}

export interface ProConfigProviderTableConfig {
  responseAdapter?: (response: unknown) => ProTableRequestResult<object>
  transformParams?: <TParams extends object>(params: TParams) => TParams
  customRenderAfter?: (value: VNodeChild, scope: unknown) => VNodeChild
  options?: boolean | ProTableOptions
  size?: ComponentSize
  border?: boolean
}

export interface ProConfigProviderFormConfig {
  size?: ComponentSize
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string | number
}

export interface ProConfigProviderDescriptionsConfig {
  size?: ComponentSize
  border?: boolean
  column?: ProDescriptionsProps<object>['column']
  emptyText?: string
}

export interface ProConfigProviderCardConfig {
  bordered?: boolean
  shadow?: 'always' | 'hover' | 'never'
  collapsible?: boolean
}

export interface ProConfigProviderListConfig {
  size?: ComponentSize
  layout?: 'list' | 'grid'
  bordered?: boolean
  emptyText?: string
  responseAdapter?: (response: unknown) => ProListRequestResult<object>
  transformParams?: <TParams extends object>(params: TParams) => TParams
}

export interface ProConfigProviderThemeConfig {
  className?: string
  variables?: Record<string, string | number>
}

export interface ProConfigProviderProps {
  size?: ComponentSize
  namespace?: string
  dark?: boolean
  theme?: ProConfigProviderThemeConfig
  field?: ProConfigProviderFieldConfig
  form?: ProConfigProviderFormConfig
  table?: ProConfigProviderTableConfig
  descriptions?: ProConfigProviderDescriptionsConfig
  card?: ProConfigProviderCardConfig
  list?: ProConfigProviderListConfig
}

export type ProConfigProviderContext = Readonly<Ref<ProConfigProviderProps>>
