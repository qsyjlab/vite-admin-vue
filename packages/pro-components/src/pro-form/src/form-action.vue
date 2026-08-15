<template>
  <div class="form-action">
    <el-space>
      <el-button
        v-if="config.showSubmit !== false"
        type="primary"
        v-bind="config.submitButtonProps"
        @click="submit"
      >
        {{ config.submitText ?? '查询' }}
      </el-button>
      <el-button v-if="config.showReset !== false" v-bind="config.resetButtonProps" @click="reset">
        {{ config.resetText ?? '重置' }}
      </el-button>
      <toggle-arrow v-if="!hiddenCollapseButton" :expanded="!collapsed" @click="toggleCollapse" />
    </el-space>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import ToggleArrow from './components/toggle-arrow.vue'

import { useFormContext } from './provider'
import type { ProFormSubmitterConfig } from './types/form'

interface IProps {
  config: ProFormSubmitterConfig
  collapsed: boolean
  hiddenCollapseButton: boolean
}

const props = defineProps<IProps>()
const justifyContent = computed(() => {
  if (props.config.align === 'start') return 'flex-start'
  if (props.config.align === 'center') return 'center'
  return 'flex-end'
})

const { submit, reset, toggleCollapse } = useFormContext()
</script>
<style lang="scss" scoped>
.form-action {
  display: flex;
  justify-content: v-bind(justifyContent);
  width: 100%;
}
</style>
