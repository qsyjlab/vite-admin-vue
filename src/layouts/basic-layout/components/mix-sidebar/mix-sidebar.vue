<template>
  <div class="mix-sidebar layout-aside_wapper">
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
