<template>
  <hover-card style="height: 100%" @click="folderMenu">
    <el-icon :size="20">
      <expand />
    </el-icon>
  </hover-card>
</template>
<script setup lang="ts">
import { Expand } from '@element-plus/icons-vue'
import { useLayoutStore } from '@/store'
import { storeToRefs } from 'pinia'

const layoutStore = useLayoutStore()

const { layoutConfig } = storeToRefs(layoutStore)

const { setLayoutConfig } = layoutStore

const folderMenu = () => {
  setLayoutConfig({
    collapsed: !layoutConfig.value.collapsed
  })
}
</script>
