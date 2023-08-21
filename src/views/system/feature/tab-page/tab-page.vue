<template>
  <el-card>
    <div>tab 栏</div>

    <el-input v-model="title"></el-input>

    <el-button type="primary" @click="setTitle(title)">设置标题</el-button>
  </el-card>
  <el-card :header="'打开新的标签页'">
    <el-button
      type="primary"
      @click="$router.push({ name: 'TabPageDetail', params: { id: new Date().getTime() } })"
      >打开新标签</el-button
    >
  </el-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useTabs } from '@/hooks'

const { setTitle } = useTabs()

const title = ref('')
</script>
<style scoped></style>
