<template>
  <div>
    <ProTable
      v-model:loading="loading"
      header-title="可编辑行"
      checkable
      :columns="columns"
      :request="request"
      :params="params"
      :transform="transform"
      :transform-params="transformParams"
      :editable="{
        mode: 'single',
        onSave,
        onDelete
      }"
      @register="register"
    >
      <template #name="{ row, editableState }">
        <el-input v-if="editableState" v-model="editableState.data.name"></el-input>
        <template v-else>
          {{ row.name }}
        </template>
      </template>
      <template #action="{ row, editableState }">
        <el-button
          v-if="!editableState || !editableState.isEdit"
          size="small"
          @click="startEditable(row.id)"
          >编辑</el-button
        >
        <el-button v-else size="small" @click="saveRow(row)">保存</el-button>
        <el-button size="small" type="danger" @click="deleteEditable(row.id)">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ProTableColumns, useProTable } from '../../.vitepress/.exampleCompnents/index'

const loading = ref(false)
const params = ref({})

const { register, refresh, startEditable, saveEditable, deleteEditable } = useProTable()

const columns: ProTableColumns = [
  {
    title: 'Date',
    key: 'date',
    editable: false
  },
  {
    title: 'Name',
    key: 'name',
    editable: true,
    rowComponent: {
      el: 'el-input'
    }
  },
  {
    title: 'Address',
    key: 'address',
    editable: true,
    rowComponent: {
      el: 'el-input'
    }
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right'
  }
]

function saveRow(row) {
  saveEditable(row.id)
  refresh()
}

function onSave(row, done) {
  done()
}

async function onDelete(row, done) {
  console.log('onDelete row', row)

  await sleep()

  done()
  refresh()
}

function sleep(delay = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({})
    }, delay)
  })
}

const request = async () => {
  await sleep()
  return Promise.resolve({
    data: [
      {
        id: 1,
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        id: 2,
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        id: 3,
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        id: 4,
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        id: 5,
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        id: 6,
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }
    ],
    total: 6
  })
}

const transformParams = params => {
  console.log('transformParams', transformParams)

  return params
}

const transform = data => {
  console.log('data', data)

  return {
    data: data.data,
    total: data.total
  }
}
</script>
<style scoped></style>
