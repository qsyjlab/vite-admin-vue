<template>
  <div style="height: 100%; box-sizing: border-box; padding: 10px">
    <page-card header="tab 栏" style="margin-bottom: 20px">
      <el-input v-model="title"></el-input>

      <el-button type="primary" @click="setTitle(title)">设置标题</el-button>
    </page-card>
    <page-card :header="'打开新的标签页'">
      <el-button
        type="primary"
        @click="$router.push({ name: 'TabPageDetail', params: { id: new Date().getTime() } })"
        >打开新标签</el-button
      >
    </page-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useTabs } from '@/hooks'
import { PageCard } from '@/components/page-card'

const { setTitle } = useTabs()

const title = ref('')
</script>
<style scoped></style>
