import { BaseValueType, ProTableColumnItem, ValueEnum, ValueType, ValueTypeVal } from '../types'

import { toDisplayString } from 'vue'
import { ElProgress, ElImage } from 'element-plus'
import Badge from '.././components/badge.vue'

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
}

export function resolveRenderer<T = any>(options: ResolveRenderOptions<T>) {
  const { row, columnConfig, valueEnum, valueType, pagination, index } = options

  const value = row[columnConfig.key]

  let realValueType = resolveValueType(valueType, row) as ValueTypeVal

  realValueType = typeof realValueType === 'string' ? realValueType : realValueType.type || 'text'

  // TODO: 优化类型
  const valueTypeRendererMap: Record<BaseValueType, any> = {
    // tsx 返回值不能是对象
    text: () => {
      if (value === null || value === undefined) return ''
      return toDisplayString(value)
    },
    // 枚举类型
    enum: () => {
      const _valueEumn = resolveValueEnum(valueEnum, row)

      const enumVal = _valueEumn[value]

      if (!enumVal) return ''

      return <Badge color={enumVal.color} text={enumVal.text} />
    },
    // 进度条
    progress: () => {
      const _realValueType = realValueType as any
      return (
        <ElProgress percentage={value} status={_realValueType?.status} color={_realValueType.color}>
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
      return value ? (
        <ElImage
          src={value}
          previewSrcList={[value]}
          initialIndex={0}
          previewTeleported
          style={{
            width: columnConfig.width || '100px'
          }}
        ></ElImage>
      ) : null
    }
  }

  const renderer = valueTypeRendererMap[realValueType]

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
