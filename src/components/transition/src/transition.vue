<template>
  <transition v-bind="$attrs">
    <slot></slot>
  </transition>
</template>

<style lang="scss" scoped>
.fade-transition {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s ease-in-out;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* fade */
/* .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
} */

/* fade-transition */
/* .fade-transition-leave-active,
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
} */
</style>
