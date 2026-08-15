<template>
  <span class="toggle" @click="toggle">
    <span class="toggle__text">{{ expanded ? collapseText : expandText }}</span>
    <el-icon class="toggle-arrow" :class="{ 'is-collapsed': !expanded }">
      <ArrowUp />
    </el-icon>
  </span>
</template>

<script setup lang="ts">
import { ArrowUp } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'

withDefaults(
  defineProps<{
    expanded?: boolean
    collapseText?: string
    expandText?: string
  }>(),
  {
    expanded: false,
    collapseText: '收起',
    expandText: '展开'
  }
)

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
.toggle-arrow.is-collapsed {
  transform: rotate(180deg);
}

.toggle__text {
  margin-right: 5px;
}
</style>
