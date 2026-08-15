<template>
  <main>
    <ProCard title="Consumer fixture">
      <ProResult status="success" title="Packages resolve" />
      <ProTable :columns="columns" :data="rows" row-key="id" />
    </ProCard>
    <ProCodeEditor v-model="source" language="json" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ProCard,
  ProResult,
  ProTable,
  type ProTableColumns
} from '@framebase/element-plus-pro-components'
import { ProCodeEditor } from '@framebase/vue-code-editor'

interface Row {
  id: number
  name: string
}

const rows: Row[] = [{ id: 1, name: 'external consumer' }]
const columns: ProTableColumns<Row> = [
  { key: 'id', dataIndex: 'id', title: 'ID' },
  { key: 'name', dataIndex: 'name', title: 'Name' }
]
const source = ref('{"ok":true}')
</script>
