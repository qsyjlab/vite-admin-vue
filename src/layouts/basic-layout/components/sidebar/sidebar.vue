<template>
  <div class="basic-layout-aside__wrapper">
    <slot name="logo"></slot>

    <div :style="scrollbarWrapperStyle">
      <el-scrollbar>
        <div class="basic-layout-aside__menus">
          <aside-menu :collapsed="props.collapsed" :menus="menus"></aside-menu>
        </div>
      </el-scrollbar>
    </div>

    <slot name="trigger">
      <div class="trigger">
        <el-button
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
import { computed, CSSProperties } from 'vue'
import { AsideMenu } from '../menu'
import { storeToRefs } from 'pinia'
import { useLayoutStore, usePermissionStore } from '@/store'
import { Fold, Expand } from '@element-plus/icons-vue'

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

const { getMenus } = usePermissionStore()

const layoutStore = useLayoutStore()
const { layoutConfig } = storeToRefs(layoutStore)

const scrollbarWrapperStyle = computed<CSSProperties>(() => {
  return {
    height: `calc(100% - ${layoutConfig.value.headerHeight}px  - 40px)`
  }
})

const menus = computed(() => {
  return getMenus()
})
</script>

<style lang="scss" scoped>
.trigger {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
</style>
