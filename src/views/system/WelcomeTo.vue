<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>

    <el-button type="primary" class="w-[166px]">asdas</el-button>

    <el-button type="danger">asdas</el-button>
    <el-button type="danger">asdas</el-button>
  </el-card>
</template>

<script setup lang="ts">
import { getTodos } from '@/api/todos'

import { onBeforeRouteUpdate, useRouter } from 'vue-router'

import axios from 'axios'
import { onMounted } from 'vue'
import {} from 'vue-router'

const router = useRouter()
onMounted(() => {
  setTimeout(() => {
    console.log('router', router.getRoutes())
  }, 1000)
})

onBeforeRouteUpdate(to => {
  console.log('to update', to)
})
</script>
