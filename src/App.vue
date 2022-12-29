<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { useStorageHelper, useLayoutConfigHandler } from './hooks'

function initAppConfig() {
  const { getLayoutCache } = useStorageHelper()
  const { initLayout } = useLayoutConfigHandler()

  initLayout(getLayoutCache() || {})
}
initAppConfig()
</script>
<style>
/* 公共样式 */
@import './styles/css/global';
</style>
