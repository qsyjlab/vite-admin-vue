<template>
  <div class="mix-sidebar basic-layout-aside_wrapper">
    <logo :show-title="false" :logo-width="75" :height="layoutConfig.headerHeight" />
    <mix-menu :header-height="layoutConfig.headerHeight" :menu-width="layoutConfig.asideWidth" />
  </div>
</template>
<script setup lang="ts">
import MixMenu from './menu/menu.vue'
import Logo from '../logo/logo.vue'
import { useLayoutStore } from '@/store'

import { storeToRefs } from 'pinia'

const { layoutConfig } = storeToRefs(useLayoutStore())
</script>
