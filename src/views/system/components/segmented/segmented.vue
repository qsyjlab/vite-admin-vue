<template>
  <page-wrapper>
    <el-space style="width: 100%" direction="vertical" fill>
      <page-card header="分段器">
        <segmented v-model="active" block :options="options" />
      </page-card>
      <page-card header="分段器 充满元素">
        <segmented v-model="active" :options="options" />
      </page-card>
      <page-card header="分段器 size">
        <div style="margin-bottom: 20px">
          默认大小
          <segmented v-model="active" :options="options" />
        </div>
        <div style="margin-bottom: 20px">
          大
          <segmented v-model="active" size="large" :options="options" />
        </div>
        <div style="margin-bottom: 20px">
          小
          <segmented v-model="active" size="small" :options="options" />
        </div>
      </page-card>

      <page-card header="禁用分段器 size">
        <div style="margin-bottom: 20px">
          部分禁用
          <segmented
            v-model="active"
            :options="[
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
            ]"
          />
        </div>
        <div style="margin-bottom: 20px">
          禁用全部
          <segmented v-model="active" size="large" :options="options" disabled />
        </div>
      </page-card>
    </el-space>
  </page-wrapper>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Segmented } from '@/components/segmented'
import { PageCard } from '@/components/page-card'
import { PageWrapper } from '@/components/page-wrapper'

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
</script>
