<!--
 * @Description: 折叠按钮
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 14:21:57
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 16:40:06
 * @FilePath: \vite-admin-vue\src\layouts\components\header\components\MenuCollapse.vue
-->
<template>
  <hover-card style="height: 100%" @click="folderMenu">
    <el-icon :size="20">
      <icon-expand></icon-expand>
    </el-icon>
  </hover-card>
</template>
<script setup lang="ts">
import { useStoreHelper } from '@/hooks'

const { useMapMutactionsHelper } = useStoreHelper()

const { collapseMenu } = useMapMutactionsHelper<VStoreRoot.app.appMutations>('app', [
  'collapseMenu'
])

const folderMenu = () => {
  collapseMenu()
}
</script>
