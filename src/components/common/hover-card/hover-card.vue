<template>
  <div class="hover-card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HoverCard'
}
</script>

<script setup lang="ts"></script>

<style scoped>
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
