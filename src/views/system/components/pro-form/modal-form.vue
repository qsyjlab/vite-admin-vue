<template>
  <page-wrapper>
    <page-card :header="$route.meta.title">
      <el-button @click="() => show()">打开</el-button>

      <el-button @click="() => show(1)">编辑</el-button>

      <ProDialogForm ref="formDialogRef" v-bind="formDialogProps" />
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import { PageWrapper, PageCard, type FormSchema } from '@/components'

import type { ProDialogFormInstance, ProDialogFormProps } from '@/components/pro-dialog-form'
import { ref } from 'vue'

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

    col: {
      span: 6
    }
  },
  {
    label: '合同约定失效效方式',
    el: 'pro-select',
    key: 'missWay',
    col: {
      span: 6
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

const formDialogProps: ProDialogFormProps = {
  dialogProps: {
    width: '50%',
    title: '新建表单'
  },
  fields: fields,
  cancelText: '关闭',
  confirmText: '确定',
  labelWidth: 100,
  labelPosition: 'top',
  addRequest: data => {
    console.log('data', data)
    return Promise.resolve(data)
  },
  getRequest: () => {
    return Promise.resolve({
      test1: '测试数据'
    })
  },
  editRequest: () => {
    return Promise.resolve()
  }
}

const formDialogRef = ref<ProDialogFormInstance>()

const show = (id?: number) => {
  formDialogRef.value?.show(id, {
    name: '测试名称'
  })
}
</script>
