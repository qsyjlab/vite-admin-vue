<template>
  <div class="setting-container">
    <div class="setting-bottom" :style="{ right: isOpenSettig ? '300px' : '0' }">
      <div
        class="setting-buttom-class"
        :style="{ backgroundColor: layoutConfig.themeColor }"
        @click="toggleSettingDrawer"
      >
        <el-icon v-if="!isOpenSettig">
          <icon-setting />
        </el-icon>
        <el-icon v-else>
          <icon-close />
        </el-icon>
      </div>
    </div>
    <div class="setting-body" :style="{ right: isOpenSettig ? '0' : '-300px' }">
      <div class="setting-title">系统布局配置</div>

      <div class="setting-item">
        <div class="setting-item-label">主题色</div>
        <div class="setting-item-content">
          <color-picker></color-picker>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isOpenSettig" class="mask-container" @click="toggleSettingDrawer"></div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store'
import { storeToRefs } from 'pinia'
import ColorPicker from './ColorPicker/ColorPicker.vue'

const appStore = useAppStore()
const { isOpenSettig, layoutConfig } = storeToRefs(appStore)

const { toggleSettingDrawer } = appStore
</script>

<style scoped>
.setting-container {
  position: fixed;
  z-index: 1004;
  top: 0;
  bottom: 0;

  right: 0;
  background-color: white;
  /* background: rgba(0, 0, 0, 0.2); */
}

.mask-container {
  position: fixed;
  z-index: 1003;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
  transition: all 0.4s;
}
.setting-body {
  position: absolute;
  width: 300px;
  height: 100%;
  top: 0;
  right: 0;
  box-sizing: border-box;
  padding: 20px;
  transition: all 0.3s;
  background-color: white;
}
.setting-bottom {
  position: absolute;
  top: 40%;
  transition: all 0.3s;
  transition-delay: 200;
  transform: translateY(-50%);
}
.setting-buttom-class {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  /* line-height: 48px; */
  outline: 0;
}
.setting-title {
  font-weight: bold;
  margin-bottom: 20px;
}
.setting-item {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
