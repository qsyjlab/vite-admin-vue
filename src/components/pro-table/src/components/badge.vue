<template>
  <span class="badge">
    <span
      :class="['badge__dot', hasPreset(color) ? `badge__dot--${color}` : '']"
      v-if="color"
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
        backgroundColor: props.color
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
.badge {
  display: flex;
  align-items: center;
  &__dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;
  }

  @each $color-name, $color-value in $colors {
    &__dot--#{$color-name} {
      background-color: $color-value;
    }
  }
}
</style>
