<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <editable-pro-table
        :height="height"
        :columns="columns"
        mode="single"
        :data="data"
        :on-delete="deleteRow"
        :on-error="onError"
        @change="changeData"
        @append-error="appendErrorHandler"
      >
        <template #name>cc</template>
      </editable-pro-table>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { EditableProTable } from '@/components/editable-pro-table'
import { PageWrapper } from '@/components/page-wrapper'
import { PageCard } from '@/components/page-card'
import type { ProTableColumns, EditableCellValidError } from '@/components/pro-table'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
const height = computed(() => {
  return `${window.innerHeight - 400}px`
})

const data = ref<any>([
  {
    id: new Date().getTime()
  }
])

const columns: ProTableColumns = [
  {
    title: '活动名称',
    key: 'name',
    tip: 'tip',
    // fixed: 'left',
    rowComponent: {
      el: 'ElInput',
      rules: [
        {
          required: true,
          validator: (value, error, callback) => {
            if (!value) return callback(new Error('错误提示有没有'))
            callback()
          },
          message: '名称必填'
        }
      ]
    }
  },

  {
    title: '状态',
    key: 'status',
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '状态' }]
    }
  },
  {
    title: '邮箱',
    key: 'email',
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '邮箱' }]
    }
  },
  {
    title: '年份',
    key: 'year',
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '年份' }]
    }
  },
  {
    title: '进度条',
    key: 'progress',
    // width: 200,
    editable: true,
    valueType: () => {
      return { type: 'progress' }
    },
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '进度条' }]
    }
  },

  {
    title: '活动时间',
    key: 'time',
    editable: true,
    rowComponent: {
      el: 'el-date-picker',
      rules: [{ required: true, message: '活动时间' }]
    }
  },
  {
    title: '操作',
    key: 'operation'
    // width: 300,
    // fixed: 'right'
  }
]

const changeData = (_d: any) => {
  data.value = _d
}

function deleteRow(row: any) {
  console.log('row', row)
}

function onError(errors: EditableCellValidError) {
  if (!errors) return
  const eValues: any[] = Object.values(errors)
  const errorMessage = eValues?.[0]?.[0] ?? '表单项填写不符合规则'
  ElMessage.error(errorMessage)
}

const appendErrorHandler = ({ message }: { message: string }) => {
  ElMessage.error(message)
}
</script>
<style scoped></style>
