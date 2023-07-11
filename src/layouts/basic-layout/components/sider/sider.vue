<template>
  <div>
    <basic-sidebar />
  </div>
</template>
<script setup lang="ts">
import BasicSidebar from '../sidebar/sidebar.vue'
import { useAppInject } from '@/application'

// import { MixSidebar as BasicMixSidebar } from './mix-sidebar'

const { isMobile } = useAppInject()
</script>
<style scoped></style>
