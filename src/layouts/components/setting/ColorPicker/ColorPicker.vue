<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-30 14:08:56
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 15:25:57
-->
<template>
  <div>
    <el-color-picker
      v-bind="{ ...$attrs }"
      v-model="colorStatus"
      @change="changeColor"
    ></el-color-picker>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store'
import { reactive, toRefs } from 'vue'

const appStore = useAppStore()
const state = reactive({
  colorStatus: appStore.layoutConfig.themeColor
})

const changeColor = (val: string) => {
  appStore.setLayoutConfig({ themeColor: val })
}

const { colorStatus } = toRefs(state)
</script>
<style scoped></style>
