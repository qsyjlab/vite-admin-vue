<template>
  <page-wrapper>
    <page-card>
      <template #header>{{ $route.meta.title }}</template>

      <el-steps :active="currentActive" align-center>
        <el-step title="创建实验" @click="nextStep"> 第一步 </el-step>
        <el-step title="设置参数" />
        <el-step title="发布实验" />
      </el-steps>
      <div style="width: 60%; margin: 0 auto">
        <pro-form
          v-show="currentActive === 1"
          :ref="ref => setRef(1, ref)"
          label-position="top"
          :fields="step1Fields"
        ></pro-form>
        <pro-form
          v-show="currentActive === 2"
          :ref="ref => setRef(2, ref)"
          label-position="top"
          :fields="step2Fields"
        ></pro-form>
        <pro-form
          v-show="currentActive === 3"
          :ref="ref => setRef(3, ref)"
          label-position="top"
          :fields="step3Fields"
        ></pro-form>

        <div>
          <el-space>
            <el-button v-if="currentActive !== 1" type="primary" @click="lastStep"
              >上一步</el-button
            >
            <el-button v-if="currentActive !== 3" type="primary" @click="nextStep"
              >下一步</el-button
            >
          </el-space>
        </div>
      </div>
    </page-card>
  </page-wrapper>
</template>
<script setup lang="ts">
import type { FormSchema, ProFormInstance } from '@/components'
import { ref } from 'vue'

const currentActive = ref(1)
const formRef = ref<Recordable<ProFormInstance>>({})

const step1Fields: FormSchema[] = [
  {
    label: '实验名称',
    el: 'el-input',
    key: 'name',
    required: true
  },
  {
    label: '日期',
    el: 'el-date-picker',
    key: 'date'
  },
  {
    label: '时间区间',
    el: 'el-date-picker',
    key: 'time123',
    attrs: {
      type: 'daterange'
    }
  },
  {
    label: '备注',
    el: 'el-input',
    key: 'remark',
    attrs: {
      type: 'textarea'
    }
  }
]

const step2Fields: FormSchema[] = [
  {
    label: '迁移类型',
    el: 'pro-checkbox-group',
    key: 'unitName',
    required: true,
    attrs: {
      options: [
        { label: '结构迁移', value: '结构迁移' },
        { label: '全量迁移', value: '全量迁移' },
        { label: '增量迁移', value: '增量迁移' }
      ]
    }
  },
  {
    label: '业务 DB 用户名',
    el: 'el-input',
    key: '业务 DB 用户名',
    col: {
      span: 12
    }
  },
  {
    label: '记录保存时间',
    el: 'el-date-picker',
    key: '记录保存时间',
    col: {
      span: 12
    }
  },
  {
    label: '迁移类型',
    el: 'pro-checkbox-group',
    key: '迁移类型',
    required: true,
    attrs: {
      options: [
        { label: '完整 LOB', value: '完整 LOB' },
        { label: '不同步 LOB', value: '不同步 LOB' },
        { label: '受限制 LOB', value: '受限制 LOB' }
      ]
    }
  }
]

const step3Fields: FormSchema[] = [
  {
    label: '部署单元',
    el: 'pro-checkbox-group',
    key: 'unitName',
    required: true,
    attrs: {
      options: [
        { label: '部署单元1', value: '部署单元1' },
        { label: '部署单元2', value: '部署单元2' },
        { label: '部署单元3', value: '部署单元3' }
      ]
    }
  },
  {
    label: '部署分组策略',
    el: 'pro-select',
    key: '部署分组策略',
    attrs: {
      options: [
        { label: '策略1', value: '策略1' },
        { label: '策略2', value: '策略2' },
        { label: '策略3', value: '策略3' }
      ]
    }
  },
  {
    label: 'Pod 调度策略',
    el: 'pro-select',
    key: 'Pod 调度策略',
    attrs: {
      options: [
        { label: '策略1', value: '策略1' },
        { label: '策略2', value: '策略2' },
        { label: '策略3', value: '策略3' }
      ]
    }
  }
]

const nextStep = () => {
  const currentForm = formRef.value?.[currentActive.value]

  if (!currentForm) return

  currentForm.validate(() => {
    if (currentActive.value >= 3) return
    currentActive.value++
  })
}

const lastStep = () => {
  currentActive.value--
}

const setRef = (index, ref: any) => {
  formRef.value[index] = ref
}
</script>
<style scoped></style>
