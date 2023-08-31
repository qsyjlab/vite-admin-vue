<template>
  <div class="basic-layout-footer__wrapper">
    <div class="basic-layout-footer__content">
      <slot> Copyright 2021 - {{ new Date().getFullYear() }} by 青衫依旧 </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineSlots<{
  default: () => void
}>()
</script>
