<template>
  <div></div>
</template>
<script setup lang="ts">
interface SegmentedItem {
  label: string
  value: string | number
  disabled?: boolean
}

const props = defineProps<{
  options: SegmentedItem[]
}>()
</script>
<style scoped></style>
