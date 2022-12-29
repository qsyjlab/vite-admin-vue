<template>
  <el-card>
    <template #header> {{ $route.meta.title }} --- {{ collapsed }} </template>
    <div>
      <VGrid :collapsed="collapsed" :gap="[20, 0]" :cols="3">
        <VGridItem>
          <el-input></el-input>
        </VGridItem>
        <VGridItem>
          <el-input></el-input>
        </VGridItem>
        <VGridItem>
          <el-input></el-input>
        </VGridItem>
        <VGridItem>
          <el-input></el-input>
        </VGridItem>
        <VGridItem suffix>
          <el-button @click="collapsed = true">展开</el-button>
          <el-button @click="collapsed = false">合并</el-button>
        </VGridItem>
      </VGrid>
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { VGrid, VGridItem } from '@/components/grid'
import { ref } from 'vue'

const collapsed = ref(false)
</script>
