<template>
  <component :is="render()" />
</template>
<script setup lang="tsx">
import { ElTableColumn, ElProgress } from 'element-plus'
import { proTableColumnProps } from './props'
import { useSlots } from 'vue'
import { Tips } from '../../tips'
import Badge from './components/badge.vue'
import type { ProTableColumnItem } from './types'

const props = defineProps(proTableColumnProps)

const slots = useSlots()

// 获取 enumValue
function runValueEnumFn<T extends any[]>(valueEnum: any, ...rest: T[]) {
  if (typeof valueEnum === 'function') return valueEnum(...rest)
  return valueEnum
}

function runValueTypeFn<T extends any[]>(valueType: any, ...rest: T[]) {
  if (typeof valueType === 'function') return valueType(...rest)
  return valueType
}

// TODO: 考虑后期 key 替换回 prop
function columnDefaultRender(columnConfig: ProTableColumnItem, scope: any) {
  const { row, column } = scope || {}
  const { valueType = 'text', valueEnum, render: _render } = columnConfig

  if (columnConfig.children && columnConfig.children.length)
    return columnConfig.children.map(child => renderColumns(child))
  if (slots[columnConfig.key]) return slots[columnConfig.key]?.({ ...scope, info: columnConfig })

  const value = row[columnConfig.key]

  if (typeof _render === 'function') return _render(row, column)

  const _valueType: any = runValueTypeFn(valueType, row)
  // TODO: 优化类型
  const valueTypeRendererMap: Record<string, any> = {
    text: () => row[columnConfig.key],

    // 枚举类型
    enum: () => {
      const _valueEumn = runValueEnumFn(valueEnum, row)
      const enumVal = _valueEumn[value]
      if (!enumVal) return ''

      return <Badge color={enumVal.color} text={enumVal.text} />
    },
    progress: () => {
      return (
        <ElProgress percentage={value} status={_valueType.status} color={_valueType.color}>
          {{
            default: ({ percentage }: { percentage: number }) => `${percentage || 0}%`
          }}
        </ElProgress>
      )
    }
  }

  const renderer =
    valueTypeRendererMap[typeof _valueType === 'string' ? _valueType : _valueType.type]
  return renderer && renderer()
}

const renderColumns = (item: ProTableColumnItem) => {
  const _item = { ...item }

  delete _item.children

  return (
    <>
      <ElTableColumn prop={String(item.key)} label={String(item.title)} {..._item}>
        {{
          default: (scope: any) => columnDefaultRender(item, scope),
          header: (scope: any) => {
            if (slots[`${item.key}Header`])
              return slots[`${item.key}Header`]?.({
                ...scope,
                info: item
              })
            return (
              <span class="column-header">
                <span class="column-header-title">{item.title}</span>
                {item.tip ? <Tips text={item.tip} /> : null}
              </span>
            )
          }
        }}
      </ElTableColumn>
    </>
  )
}

const render = () => {
  return renderColumns(props.column)
}
</script>

<style scoped>
.column-header {
  display: flex;
  align-items: center;
}

.column-header-title {
  margin-right: 5px;
}
</style>
