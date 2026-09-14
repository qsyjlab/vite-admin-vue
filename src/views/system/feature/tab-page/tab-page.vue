<template>
  <page-wrapper class="tab-page-demo">
    <g-page-header
      title="标签栏"
      description="演示 useTabs 设置当前标签标题与通过路由参数打开新标签页。"
      :icon="CollectionTag"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">setTitle</el-tag>
        <el-tag effect="plain" type="success">动态开签</el-tag>
      </template>
    </g-page-header>

    <pro-card title="设置标题" subtitle="修改当前标签页的标题">
      <div class="tab-page-demo__row">
        <el-input v-model="title" placeholder="输入新标题" />
        <el-button type="primary" @click="setTitle(title)">设置标题</el-button>
      </div>
    </pro-card>

    <pro-card title="打开新的标签页" subtitle="路由参数变化时自动生成新 tab">
      <el-button
        type="primary"
        @click="$router.push({ name: 'TabPageDetail', params: { id: new Date().getTime() } })"
        >打开新标签</el-button
      >
    </pro-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { CollectionTag } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useTabs } from '@/hooks'
import { GPageHeader, PageWrapper } from '@/components'

const { setTitle } = useTabs()

const title = ref('')
</script>
<style scoped lang="scss">
.tab-page-demo {
  gap: 16px;

  &__row {
    display: flex;
    gap: 12px;
    max-width: 480px;
  }
}
</style>
