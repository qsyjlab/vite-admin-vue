<template>
  <div class="hover-card">
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: 'HoverCard'
}
</script>
<style lang="scss" scoped>
.hover-card {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px;
}
.hover-card:hover {
  cursor: pointer;
  background-color: #f1f2f6;
}
</style>
