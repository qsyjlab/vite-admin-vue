<!--
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-30 14:08:56
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-18 16:28:12
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
import { useStore } from 'vuex'
import { reactive, toRefs } from 'vue'

const store = useStore()
const state = reactive({
  colorStatus: store.state.app.layoutConfig.themeColor
})

const changeColor = (val: string) => {
  store.commit('app/setLayoutConfig', { themeColor: val })
}

const { colorStatus } = toRefs(state)
</script>
<style scoped></style>
