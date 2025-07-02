<template>
  <component :is="renderDescriptions()" />
</template>

<script setup lang="tsx">
import { get } from 'lodash-es'
import { ElDescriptions, ElDescriptionsItem } from 'element-plus'

import type { ProDescriptionsItem } from './descriptions'
import { isFunction } from '@/utils'

/**
 * TODO: 其余属性的拓展
 */

interface IProps {
  border: boolean
  columns?: ProDescriptionsItem[]
  title: string
  data: Record<string, any>
}

const props = withDefaults(defineProps<Partial<IProps>>(), {
  columns: () => [],
  border: true
})

function renderDescriptionItem(column: ProDescriptionsItem) {
  return (
    <ElDescriptionsItem>
      {{
        default: () => {
          if (isFunction(column.render)) {
            return column.render()
          }
          return get(props.data, column.key)
        },
        label: () => column.label
      }}
    </ElDescriptionsItem>
  )
}

function renderDescriptions() {
  const { border } = props
  return (
    <ElDescriptions border={border}>
      {{
        default: () => props.columns.map(column => renderDescriptionItem(column))
      }}
    </ElDescriptions>
  )
}
</script>
