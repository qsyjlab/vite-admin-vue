import type {
  BaseValueType,
  CustomRendererFn,
  ProTableColumnItem,
  ValueEnum,
  ValueType,
  ValueTypeObject,
  ValueTypeVal
} from '../types'

import { h, isVNode, toDisplayString } from 'vue'
import { ElProgress, ElImage } from 'element-plus'
import Badge from '.././components/badge.vue'
import { resolveValue } from '../utils'
import { cloneDeep } from 'lodash-es'

interface ResolveRenderOptions<T = any> {
  row: any
  columnConfig: ProTableColumnItem<T>
  valueEnum?: ValueEnum
  valueType?: ValueType
  index: number
  pagination?: {
    page: number
    pageSize: number
  }
  customRendererMap?: Record<string, CustomRendererFn>
}

export function resolveRenderer<T = any>(options: ResolveRenderOptions<T>) {
  const { row, columnConfig, valueEnum, valueType, pagination, index, customRendererMap } = options

  const value = resolveValue(row, columnConfig.key)

  const realValueType = resolveValueType(valueType, row) as ValueTypeVal

  let valueTypeObject: ValueTypeObject = {
    type: typeof realValueType === 'string' ? realValueType : realValueType.type || 'text'
  }

  if (typeof realValueType === 'object') {
    valueTypeObject = Object.assign(valueTypeObject, { ...realValueType })
  }

  const _valueEumn = resolveValueEnum(valueEnum, row)

  if (customRendererMap) {
    const customRender = customRendererMap[valueTypeObject.type]

    if (customRender) {
      const result = customRender(
        cloneDeep({
          value,
          row,
          index,
          columnConfig,
          valueEnum: _valueEumn,
          valueType: valueTypeObject,
          pagination
        })
      )

      if (isVNode(result)) return h(result)

      return result
    }
  }

  const valueTypeRendererMap: Record<BaseValueType, any> = {
    // tsx 返回值不能是对象
    text: () => {
      if (value === null || value === undefined) return ''
      return toDisplayString(value)
    },
    // 枚举类型
    enum: () => {
      const enumVal = _valueEumn[value]

      if (!enumVal) return ''

      return <Badge color={enumVal.color} text={enumVal.text} />
    },
    // 进度条
    progress: () => {
      return (
        <ElProgress
          percentage={value}
          status={valueTypeObject?.status as any}
          color={valueTypeObject.color}
        >
          {{
            default: ({ percentage }: { percentage: number }) => `${percentage || 0}%`
          }}
        </ElProgress>
      )
    },
    // 序号列
    indexBorder: () => {
      if (!pagination) return toDisplayString('')

      const { page, pageSize } = pagination

      return (page - 1) * pageSize + index + 1
    },
    // 渲染图片
    image: () => {
      let src = value
      if (typeof valueTypeObject.src === 'function') {
        src = valueTypeObject.src(value)
      }
      return value ? (
        <ElImage
          src={src}
          previewSrcList={[src]}
          initialIndex={0}
          previewTeleported
          style={valueTypeObject.style}
        ></ElImage>
      ) : null
    }
  }

  const renderer = valueTypeRendererMap[valueTypeObject.type]

  if (!renderer) return value

  return renderer()
}

// 获取 enumValue
function resolveValueEnum<T extends any[]>(valueEnum: any, ...rest: T[]) {
  if (typeof valueEnum === 'function') return valueEnum(...rest)
  return valueEnum
}

function resolveValueType<T extends any[]>(valueType: any, ...rest: T[]) {
  if (typeof valueType === 'function') return valueType(...rest)
  return valueType
}
