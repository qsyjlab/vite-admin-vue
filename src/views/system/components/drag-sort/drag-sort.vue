<template>
  <el-card :header="$route.meta.title">
    <VDragSort>
      <VDragSortItem />
      <VDragSortItem />
      <VDragSortItem />
    </VDragSort>
  </el-card>
</template>
<script setup lang="ts">
import { VDragSort, VDragSortItem } from '@/components'
</script>
