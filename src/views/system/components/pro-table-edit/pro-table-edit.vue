<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <pro-table
        header-title="pro table"
        :columns="columns"
        :data="data"
        :params="params"
        row-key="id"
        :editable="{
          mode: 'multiple',
          enableValidate: true,
          onSave: saveRowHandler,
          onDelete(row, done) {
            delRow(row)
            done()
          },
          onChange: changeHandler,
          onError: errorHandler
        }"
        :auto-fit-height="false"
        @register="register"
      >
        <template #operation="{ row, editableState }">
          <el-button
            v-if="!(editableState && editableState.isEdit)"
            type="primary"
            @click="startEditable(row.id)"
            >编辑</el-button
          >

          <template v-else>
            <el-space>
              <el-button :loading="loading" type="primary" @click="saveEditable(row.id)"
                >保存</el-button
              >
              <el-button :loading="loading" @click="cancelEditable(row.id)">取消</el-button>
              <el-button :loading="loading" type="danger" @click="deleteEditable(row.id)"
                >删除</el-button
              >
            </el-space>
          </template>
        </template>
      </pro-table>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { useProTable } from '@/components/pro-table'
import { PageCard, PageWrapper } from '@/components'
import type { ProTableColumns, ProTableEditable } from '@/components/pro-table'

import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

const { startEditable, cancelEditable, saveEditable, register, deleteEditable } = useProTable()

const loading = ref(false)

function changeHandler(data: any) {
  console.log('changeHandler', data)
}

const delRow = row => {
  console.log('delRow', row)
}

const errorHandler: ProTableEditable['onError'] = errors => {
  console.log('errors', errors)
  if (errors) {
    ElMessage.error('请填写正确数据')
  }
}

function saveRowHandler(row: any, done: () => void) {
  console.log('save', row)
  loading.value = true

  setTimeout(() => {
    done()
    loading.value = false
  }, 200)
}

const columns: ProTableColumns = [
  {
    title: '名称',
    key: 'name',
    tip: '测试tip提示',
    fixed: 'left',
    // width: 200,
    editable: true,
    rowComponent: {
      el: 'ElInput',
      rules: [
        {
          required: true,
          validator: (value, _error, callback) => {
            if (!value) return callback(new Error('错误提示有没有'))
            callback()
          },
          message: '名称必填'
        }
      ]
    }
  },

  {
    title: '地址',
    key: 'address',
    width: 200,
    editable: true,
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '地址' }]
    }
  },
  {
    title: '邮箱',
    key: 'email',
    fixed: 'left',
    width: 200,
    editable: true,
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '邮箱' }]
    }
  },
  {
    title: '年份',
    key: 'year',
    width: 200,
    editable: true,
    rowComponent: {
      el: 'ElInput',
      rules: [{ required: true, message: '年份' }]
    }
  },
  {
    title: '进度条',
    key: 'progress',
    width: 200,
    editable: false,
    valueType: () => {
      return { type: 'progress' }
    }
  },
  {
    title: '函数式返回 enum',
    key: 'fnE',
    valueType: 'enum',
    width: 200,
    editable: false,
    valueEnum: () => {
      return {
        all: { text: '全部', color: 'blue' },
        open: {
          text: '未解决',
          color: 'green'
        },
        closed: {
          text: '已解决',
          color: 'red'
        },
        processing: {
          text: '解决中',
          color: 'blue'
        }
      }
    }
  },
  {
    title: '状态',
    key: 'status',
    valueType: 'enum',
    width: 200,
    editable: false,

    valueEnum: {
      all: { text: '全部', color: 'blue' },
      open: {
        text: '未解决',
        color: 'green'
      },
      closed: {
        text: '已解决',
        color: 'red'
      },
      processing: {
        text: '解决中',
        color: 'blue'
      }
    }
  },
  {
    title: '地址1',
    key: 'address1',
    width: 200,
    editable: true
  },
  {
    title: '操作',
    key: 'operation',
    width: 300,
    fixed: 'right'
  }
]

const data = ref<any[]>()

onMounted(() => {
  setTimeout(() => {
    data.value = createData()
  }, 0)
})

const params = ref({
  page: 1
})

function createData() {
  let data = Array(100).fill(0)

  let i = 0
  data = data.map((_item, index) => {
    return {
      id: ++i,
      name: `name-${index}`,
      age: 18,
      address: `address-${index}`,
      status: 'all',
      fnE: 'open',
      progress: 80
    }
  })

  return data
}
</script>
