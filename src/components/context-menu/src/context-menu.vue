<template>
  <teleport to="body">
    <fade-transition>
      <div
        v-if="state.visible"
        v-bind="$attrs"
        ref="contextMenuRef"
        class="context-menu"
        :style="contextMenuStyles"
        :tabindex="-1"
        @blur="blur"
      >
        <el-menu
          ref="menuRef"
          :collapse="true"
          :collapse-transition="false"
          :router="false"
          :close-on-click-outside="true"
          :teleported="false"
          :style="{
            '--el-menu-item-height': `${itemHeight}px`,
            '--el-menu-item-font-size': `${fontSize}px`
          }"
        >
          <template v-for="menu in menus" :key="menu.name">
            <menu-item :menu="menu" />
          </template>
        </el-menu>
      </div>
    </fade-transition>
  </teleport>

  <span
    v-if="$slots.default"
    ref="triggerRef"
    class="context-menu-trigger"
    v-on="triggerElementEvents"
  >
    <slot></slot>
  </span>
</template>
<script setup lang="ts">
import { checkBoundaries, getMousePosition } from '@/utils'
import MenuItem from './menu-item.vue'
import { ProContextMenuItem } from './types'
import { contextMenuKey } from './context-menu'
import { ref, reactive, computed, nextTick, provide } from 'vue'
import type { CSSProperties } from 'vue'
import { FadeTransition } from '@/components/transition'

defineOptions({
  name: 'ProContextMenu',
  inheritAttrs: false
})

type Trigger = 'click' | 'contextmenu'

const props = withDefaults(
  defineProps<{
    menus?: ProContextMenuItem[]
    closeOnClick?: boolean
    trigger?: Trigger[]
    itemHeight?: number
    fontSize?: number
  }>(),
  {
    menus: () => [],
    closeOnClick: true,
    trigger: () => ['contextmenu'],
    itemHeight: 40,
    fontSize: 14
  }
)

const emits = defineEmits<{
  (e: 'click-menu', command: ProContextMenuItem['command'], menu: ProContextMenuItem): void
}>()

const state = reactive<{
  x: number
  y: number
  visible: boolean
}>({
  x: 0,
  y: 0,
  visible: false
})

provide(contextMenuKey, {
  onClick: menuClick,
  itemHeight: props.itemHeight,
  fontSize: props.fontSize
})

const contextMenuRef = ref<HTMLDivElement>()
const triggerRef = ref<HTMLElement>()
const menuRef = ref()

const contextMenuStyles = computed<CSSProperties>(() => {
  return {
    left: `${state.x}px`,
    top: `${state.y}px`
  }
})

const triggerElementEvents = computed(() => {
  const events: Recordable<(...args: any[]) => void> = {}
  props.trigger.forEach(trigger => {
    events[trigger] = (event: MouseEvent | TouchEvent) => {
      event.preventDefault()
      show(event)
    }
  })
  return events
})

function show(event: MouseEvent | TouchEvent) {
  state.visible = true
  nextTick(() => {
    contextMenuRef.value?.focus()
    const pos = getMousePosition(event)

    if (contextMenuRef.value) {
      const { x, y } = checkBoundaries(contextMenuRef.value, pos.x, pos.y)
      pos.x = x
      pos.y = y
    }
    state.x = pos.x
    state.y = pos.y
  })
}

const blur = () => {
  state.visible = false
}

function menuClick(command: ProContextMenuItem['command'], menu: ProContextMenuItem) {
  emits('click-menu', command, menu)
  if (menu.closeOnClick !== false && props.closeOnClick) {
    state.visible = false
  }
}

defineExpose({
  show
})
</script>
<style lang="scss" scoped>
.context-menu-trigger {
  display: inline-block;
}
.context-menu {
  position: fixed;
  left: 0;
  top: 0;
  background-color: var(--el-menu-bg-color);
  z-index: 2000;
  padding: 5px 0;
  border-radius: var(--el-border-radius-small);
  box-shadow: var(--el-box-shadow-light);

  min-width: 100px;

  --el-menu-base-level-padding: 5px;
  :deep(.el-menu--collapse) {
    width: 100%;

    & > .el-sub-menu {
      & > .el-sub-menu__title .el-sub-menu__icon-arrow {
        display: block;
        top: auto;
      }
    }

    & > .el-sub-menu > .el-sub-menu__title > span,
    & > .el-menu-item > span {
      height: auto;
      width: auto;
      overflow: unset;
      visibility: unset;
    }
  }
}
</style>
