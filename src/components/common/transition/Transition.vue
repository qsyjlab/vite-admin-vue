<!--
 * @Description: 页面过度组件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-01-05 10:17:34
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 11:01:15
-->
<template>
  <transition name="fade-transform" mode="out-in">
    <slot></slot>
  </transition>
</template>
<script lang="ts">
export default {
  name: 'QsTransiton'
}
</script>
<style scoped>
/* fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
