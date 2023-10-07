<template>
  <div class="form-action">
    <el-space>
      <el-button type="primary" @click="submit">查询</el-button>
      <el-button @click="reset">重置</el-button>
      <toggle-arrow
        v-if="!hiddenCollapseButton"
        :expand="collapsed"
        @click="toggleCollapse"
      ></toggle-arrow>
    </el-space>
  </div>
</template>
<script setup lang="ts">
import ToggleArrow from './components/toggle-arrow.vue'

import { useFormActionContext } from './provider'

interface IProps {
  collapsed: boolean
  hiddenCollapseButton: boolean
}

defineProps<IProps>()

const { submit, reset, toggleCollapse } = useFormActionContext()
</script>
<style lang="scss" scoped>
.form-action {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
