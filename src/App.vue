<template>
  <app-provider>
    <router-view></router-view>
  </app-provider>
</template>
<script setup lang="ts">
import { AppProvider } from '@/application'

import { useStorageHelper, useLayoutConfigHandler } from './hooks'

function initAppConfig() {
  const { getLayoutCache } = useStorageHelper()
  const { initLayout } = useLayoutConfigHandler()

  initLayout(getLayoutCache() || {})
}
initAppConfig()
</script>
<style>
@import './styles/css/global';
</style>
