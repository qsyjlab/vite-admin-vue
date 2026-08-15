<template>
  <el-config-provider :size="config.size" :namespace="config.namespace">
    <div
      class="pro-config-provider"
      :class="[{ dark: config.dark }, config.theme?.className]"
      :style="themeStyle"
    >
      <slot />
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, inject, provide, type CSSProperties } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { mergeProConfig, proConfigProviderContextKey } from './pro-config-provider-context'
import type { ProConfigProviderProps } from './pro-config-provider'

defineOptions({
  name: 'ProConfigProvider'
})

const props = defineProps<ProConfigProviderProps>()
const parent = inject(proConfigProviderContextKey, undefined)
const config = computed(() => mergeProConfig(parent?.value ?? {}, props))
const themeStyle = computed<CSSProperties>(() => {
  const variables = config.value.theme?.variables ?? {}
  return Object.fromEntries(
    Object.entries(variables).map(([key, value]) => [
      key.startsWith('--') ? key : `--${key}`,
      value
    ])
  )
})

provide(proConfigProviderContextKey, config)
</script>

<style>
.pro-config-provider {
  display: contents;
}

.pro-config-provider.dark,
.pro-config-provider-popper--dark {
  color-scheme: dark;
  --el-bg-color-page: #0a0a0a;
  --el-bg-color: #141414;
  --el-bg-color-overlay: #1d1e1f;
  --el-text-color-primary: #e5eaf3;
  --el-text-color-regular: #cfd3dc;
  --el-text-color-secondary: #a3a6ad;
  --el-text-color-placeholder: #8d9095;
  --el-text-color-disabled: #6c6e72;
  --el-border-color-darker: #636466;
  --el-border-color-dark: #58585b;
  --el-border-color: #4c4d4f;
  --el-border-color-light: #414243;
  --el-border-color-lighter: #363637;
  --el-border-color-extra-light: #2b2b2c;
  --el-fill-color-darker: #424243;
  --el-fill-color-dark: #39393a;
  --el-fill-color: #303030;
  --el-fill-color-light: #262727;
  --el-fill-color-lighter: #1d1d1d;
  --el-fill-color-extra-light: #191919;
  --el-fill-color-blank: transparent;
  --el-disabled-bg-color: var(--el-fill-color-light);
  --el-disabled-border-color: var(--el-border-color-light);
  --el-disabled-text-color: var(--el-text-color-placeholder);
  --el-menu-text-color: var(--el-text-color-regular);
  --el-menu-hover-text-color: var(--el-text-color-primary);
  --el-table-text-color: var(--el-text-color-regular);
  --el-table-header-text-color: var(--el-text-color-primary);
  --el-pagination-text-color: var(--el-text-color-regular);
  --el-pagination-button-color: var(--el-text-color-regular);
  --el-input-text-color: var(--el-text-color-regular);
  --el-input-placeholder-color: var(--el-text-color-placeholder);
  --el-select-input-color: var(--el-text-color-regular);
  --el-box-shadow-light: 0 0 12px rgb(0 0 0 / 72%);
  --global-bg-color: var(--el-bg-color-page);
  --global-bg-color-2: var(--el-bg-color);
  --global-surface-color: var(--el-bg-color);
  --global-surface-color-elevated: var(--el-bg-color-overlay);
  --global-surface-color-muted: var(--el-fill-color-lighter);
  --global-hover-color: var(--el-fill-color-light);
  --global-hover-color-strong: var(--el-fill-color);
  --global-border-color: var(--el-border-color);
  --global-border-color-strong: var(--el-border-color-dark);
  --global-text-color-regular: var(--el-text-color-regular);
  --global-text-color-secondary: var(--el-text-color-secondary);
  --global-text-color-placeholder: var(--el-text-color-placeholder);
  --global-heading-color: var(--el-text-color-primary);
}
</style>
