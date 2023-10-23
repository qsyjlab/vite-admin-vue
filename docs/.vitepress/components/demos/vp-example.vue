<script setup lang="ts">
defineProps({
  file: {
    type: String,
    required: true
  },
  demo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="example-showcase vp-raw">
    <ClientOnly>
      <component class="vp-raw" :is="demo" v-if="demo" v-bind="$attrs" />
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped>
.example-showcase {
  width: 100%;
  overflow: auto;
}
</style>
