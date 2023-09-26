<template>
  <div>
    <VProTable
      :options="false"
      :data="[]"
      :pagination="false"
      :columns="columns"
      :row-key="'id'"
      @register="register"
    >
      <template #drag> </template>
    </VProTable>

    <el-table ref="ttTableRef" :data="tabledata2" style="width: 100%">
      <el-table-column prop="drag" label="Drag" width="180">
        <div class="drag">
          <el-icon><Rank /></el-icon>
        </div>
      </el-table-column>
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { Rank } from '@element-plus/icons-vue'

import { VProTable, useProTable } from '../../pro-table'
import type { ProTableColumns } from '../../pro-table'
import Sortable from 'sortablejs'
import { onMounted } from 'vue'
import { toRefs } from 'vue'
import { watchEffect } from 'vue'
import { nextTick } from 'vue'
import { ref } from 'vue'
import { useAttrs } from 'vue'

const ttTableRef = ref()

interface IProps {
  data2?: any[]
  columns?: ProTableColumns
}
const props = withDefaults(defineProps<IProps>(), {
  columns: () => [],
  data2: () => []
})

const attrs = useAttrs()

const { register, getTableRef } = useProTable()

const sortableInstance: Sortable | null = null

// const { data2: data2Source } = toRefs(props)

const tabledata2 = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
])

onMounted(async () => {
  const tableRef = await getTableRef()
  if (ttTableRef.value) {
    console.log('asdasdasd', ttTableRef.value.$el.querySelector('tbody'))
    // const cloneddata2 = JSON.parse(JSON.stringify(data2Source.value))
    new Sortable(ttTableRef.value.$el.querySelector('tbody'), {
      handle: '.drag', // handle's class
      animation: 50,
      onEnd: () => {
        tabledata2.value.push({
          id: new Date().getTime()
        })
      }
    })
  }
})

watchEffect(() => {
  console.log('props', attrs)

  console.log('data2', props.data2)

  console.log('data2Source.value', ttTableRef.value)

  console.log('tabledata2', tabledata2.value)
})
</script>
<style scoped></style>
