<template>
  <transition v-bind="$attrs">
    <slot></slot>
  </transition>
</template>

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

/* fade-transition */
.fade-transition-leave-active,
.fade-transition-enter-active {
  transition: all 0.3s;
}

.fade-transition-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transition-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
