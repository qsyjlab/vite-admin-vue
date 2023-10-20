<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <editable-pro-table
        :columns="columns"
        mode="multiple"
        :data="data"
        :onDelete="deleteRow"
        @change="changeData"
        @append-error="appendErrorHandler"
      ></editable-pro-table>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { EditableProTable } from '@/components/editable-pro-table'
import { PageWrapper } from '@/components/page-wrapper'
import { PageCard } from '@/components/page-card'
import { ProTableColumns } from '@/components/pro-table'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

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

function deleteRow(row) {
  console.log('row', row)
}

const appendErrorHandler = ({ message }: { message: string }) => {
  ElMessage.error(message)
}
</script>
<style scoped></style>
