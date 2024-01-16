<template>
  <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false">
    <template #default="{ data }">
      <span class="custom-tree-node">
        <span>{{ getLabel(data) }}</span>
        <span>
          <!-- <a @click="append(data)"> Append </a>
          <a style="margin-left: 8px" @click="remove(node, data)"> Delete </a> -->
        </span>
      </span>
    </template>
  </el-tree>
</template>
<script setup lang="ts">
defineProps<{
  data: any[]
}>()

function getLabel(node) {
  return node.el?.innerText
}
</script>
<style scoped></style>
