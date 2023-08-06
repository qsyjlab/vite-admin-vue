<template>
  <component :is="render()" />
</template>
<script setup lang="tsx">
import { ElTableColumn } from 'element-plus'
import { proTableColumnProps, ProTableColumnItem } from './props'
import { useSlots } from 'vue'
import { Tips } from '../../tips'
const props = defineProps(proTableColumnProps)

const slots = useSlots()

const renderColumns = (item: ProTableColumnItem) => {
  const _item = { ...item }

  delete _item.children

  return (
    <>
      <ElTableColumn prop={String(item.key)} label={String(item.title)} {..._item}>
        {{
          default: (scope: any) => {
            const { row } = scope || {}
            if (item.children && item.children.length)
              return item.children.map(child => renderColumns(child))

            if (slots[item.key]) return slots[item.key]?.({ ...scope, info: item })
            return row[item.key]
          },
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
