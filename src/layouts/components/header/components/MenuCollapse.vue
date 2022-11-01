<template>
  <hover-card style="height: 100%" @click="folderMenu">
    <el-icon :size="20">
      <icon-expand></icon-expand>
    </el-icon>
  </hover-card>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store'

const appStore = useAppStore()

const { collapseMenu } = appStore

const folderMenu = () => {
  collapseMenu()
}
</script>
