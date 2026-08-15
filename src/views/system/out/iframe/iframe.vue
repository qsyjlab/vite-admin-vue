<template>
  <div class="iframe-out-page">
    <header class="iframe-out-page__header">
      <div class="iframe-out-page__title">
        <div class="iframe-out-page__title-icon">
          <Link />
        </div>
        <div>
          <h1>内嵌外部页面</h1>
          <p>通过 IframePage 组件加载外部链接，支持加载状态与地址切换。</p>
        </div>
      </div>
      <div class="iframe-out-page__capabilities">
        <el-tag effect="plain" type="primary">加载态</el-tag>
        <el-tag effect="plain" type="success">地址切换</el-tag>
        <el-tag effect="plain" type="warning">KeepAlive</el-tag>
      </div>
    </header>

    <div class="iframe-out-page__bar">
      <el-input
        v-model="currentSrc"
        placeholder="请输入外部页面地址"
        clearable
        class="iframe-out-page__input"
        @keyup.enter="applySrc"
      >
        <template #prefix>
          <Link />
        </template>
      </el-input>
      <el-button type="primary" :icon="Refresh" @click="applySrc">加载</el-button>
      <el-button :icon="RefreshRight" @click="reload">刷新</el-button>
      <el-dropdown trigger="click" @command="onPreset">
        <el-button :icon="Files">预设地址</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in presets" :key="item.url" :command="item.url">
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="iframe-out-page__stage">
      <IframePage :key="frameKey" :frame-src="activeSrc"></IframePage>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Files, Link, Refresh, RefreshRight } from '@element-plus/icons-vue'
import { IframePage } from '@/components'
import config from '@/config'

defineOptions({ name: 'IframeOutPage' })

const presets = [
  { label: '项目文档', url: config.docxLink },
  { label: 'Vue 官网', url: 'https://vuejs.org/' },
  { label: 'Element Plus', url: 'https://element-plus.org/' }
]

const currentSrc = ref(config.docxLink)
const activeSrc = ref(config.docxLink)
const frameKey = ref(0)

function applySrc() {
  if (!currentSrc.value) return
  activeSrc.value = currentSrc.value
  frameKey.value += 1
}

function reload() {
  frameKey.value += 1
}

function onPreset(url: string) {
  currentSrc.value = url
  activeSrc.value = url
  frameKey.value += 1
}
</script>

<style scoped lang="scss">
.iframe-out-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 0;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 24px;
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-9),
      var(--el-color-success-light-9)
    );
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;

    h1 {
      margin: 0;
      font-size: 22px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 6px 0 0;
      color: var(--el-text-color-secondary);
    }
  }

  &__title-icon {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: var(--global-layout-radius);
    background: linear-gradient(135deg, #409eff, #1677ff);
    color: #fff;
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.32);

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__capabilities {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    flex: none;
  }

  &__bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-bg-color-overlay);
  }

  &__input {
    flex: 1;
    min-width: 0;
  }

  &__stage {
    flex: 1;
    min-height: 0;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    overflow: hidden;
    background: var(--el-bg-color-overlay);
  }
}

@media (max-width: 760px) {
  .iframe-out-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .iframe-out-page__capabilities {
    justify-content: flex-start;
  }

  .iframe-out-page__bar {
    flex-wrap: wrap;
  }
}
</style>
