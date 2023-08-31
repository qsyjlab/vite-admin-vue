<template>
  <div class="anchor__link" @click="e => anchorClickHandler(e, anchor)">
    <div :class="['anchor__title', activeKey === anchor.link ? 'active' : '']">
      {{ anchor.title }}
    </div>

    <div class="anchor__children">
      <template v-for="child in anchor.children" :key="child.link">
        <AnchorLink
          :anchor="child"
          :active-key="activeKey"
          @click="e => anchorClickHandler(e, child)"
        />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { AnchorItem } from './anchor'
import AnchorLink from './anchor-link.vue'
import './anchor.scss'

withDefaults(
  defineProps<{
    anchor: AnchorItem
    activeKey?: string
  }>(),
  {}
)

const emits = defineEmits<{
  click: [event: MouseEvent, anchor: AnchorItem]
}>()

const anchorClickHandler = (event: MouseEvent, anchor: AnchorItem) => {
  emits('click', event, anchor)
}
</script>
<style scoped></style>
