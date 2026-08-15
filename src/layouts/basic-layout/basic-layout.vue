<template>
  <basic-layout-core
    :layout-config="layoutConfig"
    :mix-menu-layout-config="mixMenuLayoutConfig"
    :container-component="container"
    :is-mobile="isMobile"
    :project-title="config.projectTitle"
    :show-back-top="projectSetting.defaultLayoutSetting.showBackTop"
    :show-setting-button="projectSetting.defaultLayoutSetting.showSettingButton"
    :show-header="projectSetting.defaultLayoutSetting.showHeader"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'
import { useAppInject } from '@/application'
import createBlankContainer from '@/layouts/container/createBlankContainer'
import projectSetting from '@/config/project-setting'
import config from '@/config'
import BasicLayoutCore from './basic-layout-core.vue'

defineOptions({
  name: 'BasicLayout'
})

const { layoutConfig, mixMenuLayoutConfig } = storeToRefs(useLayoutStore())
const { isMobile } = useAppInject()
const container = createBlankContainer('BasicLayout')
</script>
