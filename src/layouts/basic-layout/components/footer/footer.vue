<template>
  <div class="footer">Copyright 2021 - {{ year }} by 青衫依旧</div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
<style scoped>
.footer {
  text-align: center;
  font-size: 14px;
}
</style>
