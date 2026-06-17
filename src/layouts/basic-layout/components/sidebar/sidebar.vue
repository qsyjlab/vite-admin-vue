<template>
  <div class="basic-layout-aside__wrapper">
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
  }
  .trigger {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 12px;
    flex-shrink: 0;
  }

  .collapse-trigger-btn {
    width: 34px;
    min-width: 34px;
    height: 34px;
    padding: 0;
    border-radius: 10px;
    color: var(--global-text-color-secondary);
    border: 1px solid var(--global-border-color);
    background: #fff;
    box-shadow: none;

    &:hover,
    &:focus {
      color: var(--el-color-primary);
      border-color: #d8e4ff;
      background: #f6f9ff;
    }
  }
}
</style>
