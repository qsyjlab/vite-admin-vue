<template>
  <span class="toggle" @click="toggle">
    <span style="margin-right: 5px">{{ !expand ? unExpandText : expandText }}</span>
    <el-icon :class="['toggle-arrow ', !expand ? 'active' : '']">
      <ArrowUp></ArrowUp>
    </el-icon>
  </span>
</template>

<script setup lang="ts">
import { ArrowUp } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'

withDefaults(
  defineProps<{
    expand?: boolean
    expandText?: string
    unExpandText?: string
  }>(),
  {
    expand: false,
    expandText: '折叠',
    unExpandText: '展开'
  }
)

// defineProps({
//   expand: {
//     type: Boolean,
//     default: false
//   },

// })

const emits = defineEmits({
  click: () => true
})

const toggle = () => {
  emits('click')
}
</script>

<style scoped>
.toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--el-color-primary, #409eff);
  font-size: var(--el-font-size-base, 14px);
  white-space: nowrap;
}
.toggle-arrow {
  display: inline-block;
  transform: rotate(0deg);
  transform-origin: center center;
  transition: all 0.3s ease 0.1s;
  cursor: pointer;
}
.toggle-arrow.active {
  transform: rotate(180deg);
}
</style>
