<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>

    <el-button type="primary">asdas</el-button>

    <el-button type="danger">asdas</el-button>
    <el-button type="danger">asdas</el-button>
  </el-card>
</template>

<script setup lang="ts">
import { getTodos } from '@/api/todos'

import axios from 'axios'
</script>
