<template>
  <div class="footer">Copyright 2021 - {{ year }} by 青衫依旧</div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
<style scoped>
.footer {
  height: 100%;
  text-align: center;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
