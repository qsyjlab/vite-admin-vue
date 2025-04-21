<template>
  <page-wrapper>
    <page-card>
      <template #header>{{ $route.meta.title }}</template>

      <el-button type="primary" @click="visible = true">打开抽屉</el-button>

      <el-drawer v-model="visible" direction="rtl" size="50%">
        <pro-form :label-width="150" :fields="fields"> </pro-form>
        <template #footer>
          <div>
            <el-button>取消</el-button>
            <el-button type="primary">确定</el-button>
          </div>
        </template>
      </el-drawer>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
/// <reference types="../../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import type { FormSchema } from '@/components'
import { ref } from 'vue'

const visible = ref(false)

const fields: FormSchema[] = [
  {
    label: '签约客户名称',
    el: 'el-input',
    key: 'name',
    col: {
      span: 12
    }
  },
  {
    label: '我方公司名称',
    el: 'el-input',
    key: 'selfCompany',
    col: {
      span: 12
    }
  },
  {
    label: '合同名称',
    el: 'el-input',
    key: 'ht',
    col: {
      span: 12
    }
  },
  {
    label: '合同生效时间',
    el: 'el-date-picker',
    key: 'startTime',
    attrs: {
      type: 'daterange'
    },
    col: {
      span: 12
    }
  },
  {
    label: '合同约定生效方式',
    el: 'pro-select',
    key: 'way',
    fill: true,
    col: {
      span: 24
    }
  },
  {
    label: '合同约定失效效方式',
    el: 'pro-select',
    key: 'missWay',
    fill: true,
    col: {
      span: 24
    }
  },

  {
    label: '项目名称',
    el: 'el-input',
    key: 'projectName'
  },
  {
    label: '商务经理',
    el: 'el-input',
    key: 'bName'
  }
]
</script>
