<template>
  <page-wrapper class="segmented-page">
    <g-page-header
      title="segmented 分段器"
      description="展示分段器的块状布局、三种尺寸与整体/部分禁用状态。"
      :icon="MoreFilled"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">块状布局</el-tag>
        <el-tag effect="plain" type="success">尺寸</el-tag>
        <el-tag effect="plain" type="info">禁用</el-tag>
      </template>
    </g-page-header>

    <pro-card title="基础用法" subtitle="block 模式撑满整行">
      <segmented v-model="active" block :options="options" />
    </pro-card>

    <pro-card title="三种尺寸">
      <div class="segmented-page__row">
        <span class="segmented-page__label">默认大小</span>
        <segmented v-model="active" :options="options" />
      </div>
      <div class="segmented-page__row">
        <span class="segmented-page__label">大</span>
        <segmented v-model="active" size="large" :options="options" />
      </div>
      <div class="segmented-page__row">
        <span class="segmented-page__label">小</span>
        <segmented v-model="active" size="small" :options="options" />
      </div>
    </pro-card>

    <pro-card title="禁用状态">
      <div class="segmented-page__row">
        <span class="segmented-page__label">部分禁用</span>
        <segmented v-model="active" :options="partialDisabledOptions" />
      </div>
      <div class="segmented-page__row">
        <span class="segmented-page__label">禁用全部</span>
        <segmented v-model="active" size="large" :options="options" disabled />
      </div>
    </pro-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { MoreFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { GPageHeader, PageWrapper } from '@/components'
import { Segmented } from '@/components/segmented'

defineOptions({
  name: 'Segmented'
})

const active = ref<string>('Map')

const options = [
  {
    label: 'Map',
    value: 'Map'
  },
  {
    label: 'Transit',
    value: 'Transit'
  },
  {
    label: 'Satellite',
    value: 'Satellite'
  }
]

const partialDisabledOptions = [
  { label: 'Map', value: 'Map' },
  { label: 'Transit', value: 'Transit', disabled: true },
  { label: 'Satellite', value: 'Satellite' }
]
</script>

<style scoped lang="scss">
.segmented-page {
  gap: 16px;

  &__row {
    display: flex;
    align-items: center;
    gap: 12px;

    & + & {
      margin-top: 16px;
    }
  }

  &__label {
    width: 72px;
    flex: none;
    color: var(--el-text-color-regular);
    font-size: 14px;
  }
}
</style>
