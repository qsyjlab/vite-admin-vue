<template>
  <el-form
    v-bind="{ ...$attrs }"
    :inline="inline"
    :model="formModel"
    :rules="formRules"
    :ref="ref => setFormRef(ref)"
    @submit.prevent
  >
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in formSchemaes"
        v-bind="item.col"
        :key="`${item.key}`"
        v-show="!inline ? true : fieldsIsCollapsedMap[item.key]"
      >
        <el-form-item style="width: 100%" :label="item.label" :prop="item.key || String(index)">
          <component
            :is="item.el"
            v-model="formModel[item.key]"
            v-bind="handleElAttrs(item)"
            v-on="item.events || {}"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="inline" v-bind="advancedSpanColAttrs">
        <form-action
          :collapsed="advanceState.isAdvanced"
          :hidden-collapse-button="advanceState.hideAdvanceBtn"
        ></form-action>
      </el-col>
    </el-row>

    <!-- 只提供 inline 模式下的操作按钮 -->
  </el-form>
</template>

<script setup lang="ts">
import { formProps, formEmits, emitsEnums } from './form-props'
import { useForm } from './form'
import { ElForm, ElFormItem } from 'element-plus'

import { createFormActionContext } from './provider'

import FormAction from './form-action.vue'

defineOptions({
  name: 'ProForm'
})

const props = defineProps(formProps)

const emits = defineEmits(formEmits)

const {
  formSchemaes,
  advanceState,
  formModel,
  formRules,
  handleElAttrs,
  setFormRef,
  validate,
  resetFields,
  toggleCollapse,
  formExposeMethods,
  fieldsIsCollapsedMap,
  advancedSpanColAttrs
} = useForm({
  props,
  emits
})

const submit = () => {
  validate(() => {
    emits(emitsEnums.SUBMIT, formModel)
  })
}

const reset = () => {
  resetFields(() => {
    emits(emitsEnums.RESET, formModel)
  })
}

createFormActionContext({
  submit,
  reset,
  toggleCollapse
})

defineExpose(formExposeMethods)
</script>
