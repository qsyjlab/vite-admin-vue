<template>
  <page-wrapper>
    <page-card>
      <template #header>
        {{ $route.meta.title }}
      </template>
      <el-button type="primary" class="w-300px">asdas</el-button>

      <el-button type="danger">asdas</el-button>
      <el-button type="danger">asdas</el-button>

      <ProIcon icon="ify.ant-design:alert-filled" color="red" />
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ProIcon } from '@/components/icon'
</script>
