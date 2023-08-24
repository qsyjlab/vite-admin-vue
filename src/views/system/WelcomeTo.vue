<template>
  <el-card>
    <template #header>
      {{ $route.meta.title }}
    </template>

    <el-button type="primary" class="w-[166px]">asdas</el-button>

    <el-button type="danger">asdas</el-button>
    <el-button type="danger">asdas</el-button>

    <IconSelector icon="ify.ant-design:alert-filled" color="red" />
  </el-card>
</template>

<script setup lang="ts">
import { IconSelector } from '@/components/icon'
</script>
