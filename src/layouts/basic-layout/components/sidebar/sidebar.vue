<template>
  <div :class="['basic-layout-aside__wrapper', props.collapsed ? 'is-collapsed' : '']">
    <slot name="logo"></slot>

    <div class="scroll-wrapper">
      <el-scrollbar>
        <div class="basic-layout-aside__menus">
          <aside-menu :collapsed="props.collapsed" :menus="menus"></aside-menu>
        </div>
      </el-scrollbar>
    </div>

    <slot name="trigger">
      <div class="trigger">
        <el-button
          class="collapse-trigger-btn"
          text
          bg
          @click="layoutStore.setLayoutConfig({ collapsed: !layoutConfig.collapsed })"
        >
          <el-icon :size="14">
            <Fold v-if="!layoutConfig.collapsed" />
            <Expand v-else />
          </el-icon>
        </el-button>
      </div>
    </slot>
    <div></div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { AsideMenu } from '../menu'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useLayoutMenu } from '@/hooks'

interface IProps {
  collapsed?: boolean
}

defineSlots<{
  logo: () => void
  trigger: () => void
}>()

const props = withDefaults(defineProps<IProps>(), {
  collapsed: false
})

const layoutStore = useLayoutStore()
const { layoutConfig } = storeToRefs(layoutStore)
const { menus } = useLayoutMenu(
  computed(() => {
    return {
      type: 'left'
    }
  })
)
</script>

<style lang="scss" scoped>
.basic-layout-aside__wrapper {
  display: flex;
  flex-direction: column;

  .scroll-wrapper {
    flex: auto;
    min-height: 0;

    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }

    :deep(.el-scrollbar__bar.is-horizontal) {
      display: none;
    }
  }
  .trigger {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 12px;
    flex-shrink: 0;
  }

  .collapse-trigger-btn {
    width: 32px;
    min-width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 6px;
    color: var(--global-text-color-regular);
    border: none;
    background: transparent;
    box-shadow: none;

    &:hover,
    &:focus {
      color: var(--el-color-primary);
      background: var(--global-hover-color);
      border: none;
    }

    &:active {
      background: var(--el-fill-color);
    }
  }

  &.is-collapsed {
    .scroll-wrapper {
      overflow: hidden;

      :deep(.el-scrollbar__wrap) {
        overflow-x: hidden;
      }

      :deep(.el-scrollbar__view) {
        min-width: 0;
      }
    }

    :deep(.basic-layout-aside__menus) {
      width: 60px;
      padding: 8px 4px;
      box-sizing: border-box;
    }

    :deep(.el-menu--collapse) {
      --el-menu-icon-width: 20px;
      --el-menu-base-level-padding: 16px;

      width: 52px;
    }

    :deep(.el-menu--collapse > .el-menu-item),
    :deep(.el-menu--collapse > .el-sub-menu > .el-sub-menu__title) {
      width: 52px;
      height: 44px;
      padding: 0 !important;
      justify-content: center;
      gap: 0 !important;
    }

    :deep(.el-menu--collapse > .el-menu-item .ellipsis),
    :deep(.el-menu--collapse > .el-sub-menu > .el-sub-menu__title .ellipsis) {
      display: none !important;
    }

    :deep(.el-menu--collapse .icon) {
      margin: 0;
    }

    :deep(.el-menu--collapse .el-menu-tooltip__trigger) {
      justify-content: center;
      gap: 0;
      padding: 0 !important;
    }

    .trigger {
      justify-content: center;
      padding: 12px 4px;
    }
  }
}
</style>
