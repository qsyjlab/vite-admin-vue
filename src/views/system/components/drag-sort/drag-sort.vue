<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <VDragSort>
        <VDragSortItem />
        <VDragSortItem />
        <VDragSortItem />
      </VDragSort>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { VDragSort, VDragSortItem } from '@/components'
</script>
