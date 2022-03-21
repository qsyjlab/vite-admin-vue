<!--
 * @Description: footer
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 11:02:35
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 22:52:49
 * @FilePath: \vite-admin-vue\src\layouts\LayoutPackage\components\LayoutFooter.vue
-->

<template>
  <div class="layout-footer" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 开启fixed布局 */
  fixed?: boolean
  /** fixed布局的层级 */
  zIndex?: number
  /** 最小宽度 */
  minWidth?: number
  /** 高度 */
  height?: number
  /** 左侧内边距 */
  paddingLeft?: number
  /** 动画过渡时间 */
  transitionDuration?: number
  /** 动画过渡时间 */
  transitionTimingFunction?: string
}

const props = withDefaults(defineProps<Props>(), {
  fixed: true,
  zIndex: 999,
  minWidth: 1200,
  height: 56,
  paddingLeft: 0,
  transitionDuration: 300,
  transitionTimingFunction: 'ease-in-out'
})

const style = computed(() => {
  const {
    fixed,
    zIndex,
    minWidth,
    height,
    paddingLeft,
    transitionDuration,
    transitionTimingFunction
  } = props
  const position = fixed ? 'fixed' : 'static'
  return ` z-index: ${zIndex};;height: ${height}px;padding-left: ${paddingLeft}px;transition-duration: ${transitionDuration}ms;transition-timing-function: ${transitionTimingFunction};box-sizing: border-box;`
})
</script>

<style scoped>
.layout-footer {
  box-sizing: border-box;
  flex: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 20px 0;
}
</style>
