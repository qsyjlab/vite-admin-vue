<template>
  <span class="badge">
    <span
      v-if="color"
      :class="['badge__dot', hasPreset(color) ? `badge__dot--${color}` : '']"
      :style="dynamicStyles"
    ></span>
    <span v-if="text || $slots.text">
      <slot name="text">{{ text }}</slot>
    </span>
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

const props = defineProps<{
  text?: string
  color?: string
}>()

defineSlots<{
  text(): any
}>()

const hasPreset = (color: string) =>
  [
    'pink',
    'red',
    'yellow',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'magenta',
    'volcano',
    'gold',
    'lime'
  ].includes(color)

const dynamicStyles = computed<CSSProperties>(() => {
  return hasPreset(props.color || '')
    ? {}
    : {
        backgroundColor: props.color,
        color: props.color
      }
})
</script>
<style lang="scss" scoped>
$colors: (
  pink: pink,
  red: red,
  yellow: yellow,
  orange: orange,
  cyan: cyan,
  green: green,
  blue: blue,
  purple: purple,
  geekblue: geekblue,
  magenta: magenta,
  volcano: volcano,
  gold: gold,
  lime: lime
);

@keyframes statusProcessing {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}
.badge {
  display: flex;
  align-items: center;
  &__dot {
    display: inline-block;
    position: relative;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;
    &::after {
      position: absolute;
      top: 0;
      inset-inline-start: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-width: 1px;
      border-style: solid;
      border-color: inherit;
      border-radius: 50%;
      animation-name: statusProcessing;
      animation-duration: 1.2s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      content: '';
    }
  }

  @each $color-name, $color-value in $colors {
    &__dot--#{'' + $color-name} {
      background-color: $color-value;
      color: $color-value;
    }
  }
}
</style>
