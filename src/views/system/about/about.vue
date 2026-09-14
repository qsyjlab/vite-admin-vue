<template>
  <page-wrapper class="about-page">
    <g-page-header title="关于" description="项目基本信息与依赖清单。" :icon="InfoFilled">
      <template #actions>
        <el-tag effect="plain" type="primary">{{ config.projectTitle }}</el-tag>
      </template>
    </g-page-header>

    <pro-card title="项目信息">
      <pro-descriptions
        :columns="infoColumns"
        :data="{
          name: config.projectTitle
        }"
      ></pro-descriptions>
    </pro-card>

    <pro-card title="dependencies" :subtitle="`共 ${depCount} 个运行时依赖`">
      <pro-descriptions :columns="schema" :data="pkg.dependencies"></pro-descriptions>
    </pro-card>

    <pro-card title="devDependencies">
      <pro-descriptions :columns="devSchema" :data="pkg.devDependencies"></pro-descriptions>
    </pro-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
import config from '@/config'
import { GPageHeader, PageWrapper } from '@/components'
import {
  ProCard,
  ProDescriptions,
  type ProDescriptionColumns
} from '@framebase/element-plus-pro-components'
import { h } from 'vue'
import { ElLink } from 'element-plus'
import { computed } from 'vue'

const { pkg } = __APP_INFO__

const infoColumns: ProDescriptionColumns = [
  {
    label: '项目名称',
    key: 'name',
    dataIndex: 'name'
  },
  {
    label: '文档地址',
    key: 'docs',
    render: () => {
      return h(
        ElLink,
        {
          href: config.docxLink,
          target: '_blank'
        },
        () => '文档地址'
      )
    }
  },
  {
    label: 'GitHub',
    key: 'github',
    render: () => {
      return h(
        ElLink,
        {
          href: pkg.repository.url,
          target: '_blank'
        },
        () => '	Github'
      )
    }
  }
]

const schema: ProDescriptionColumns = []
const devSchema: ProDescriptionColumns = []

Object.keys(pkg.dependencies).forEach(key => {
  schema.push({ key, dataIndex: key, label: key })
})

Object.keys(pkg.devDependencies).forEach(key => {
  devSchema.push({ key, dataIndex: key, label: key })
})

const depCount = computed(() => Object.keys(pkg.dependencies).length)
</script>
<style scoped lang="scss">
.about-page {
  gap: 16px;
}
</style>
