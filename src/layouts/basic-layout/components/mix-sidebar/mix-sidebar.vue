<template>
  <div class="mix-sidebar basic-layout-aside__wrapper">
    <logo :show-title="false" :width="60" :logo-width="46" :height="layoutConfig.headerHeight" />
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

<style lang="scss" scoped>
.mix-sidebar {
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  border-right: 0;

  &::after {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    content: '';
    pointer-events: none;
    background-color: var(--mix-sidebar-divider-color, var(--layout-line-color));
  }

  :deep(.basic-layout-mix-menu) {
    height: auto;
    min-height: 0;
    flex: 1 1 auto;
  }
}
</style>
