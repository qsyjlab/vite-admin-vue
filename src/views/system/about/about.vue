<template>
  <page-wrapper>
    <page-card style="margin-bottom: 15px" header="项目信息" :full="false">
      <pro-descriptions
        :columns="infoColumns"
        :data="{
          name: config.projectTitle
        }"
      ></pro-descriptions>
    </page-card>
    <page-card style="margin-bottom: 15px" header="dependencies" :full="false">
      <pro-descriptions :columns="schema" :data="pkg.dependencies"></pro-descriptions>
    </page-card>

    <page-card header="devDependencies" :full="false">
      <pro-descriptions :columns="devSchema" :data="pkg.devDependencies"></pro-descriptions>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import config from '@/config'
import { ProDescriptions, ProDescriptionColumns } from '@/components/pro-descriptions'
import { h } from 'vue'
import { ElLink } from 'element-plus'

const { pkg } = __APP_INFO__

const infoColumns: ProDescriptionColumns = [
  {
    label: '项目名称',
    key: 'name'
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
  schema.push({ key, label: key })
})

Object.keys(pkg.devDependencies).forEach(key => {
  devSchema.push({ key, label: key })
})
</script>
<style scoped></style>
