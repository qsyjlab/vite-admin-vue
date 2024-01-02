<template>
  <el-form
    v-bind="{ ...$attrs }"
    :ref="ref => setFormRef(ref)"
    :model="formModel"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :disabled="disabled"
    :inline-message="inlineMessage"
    :label-suffix="labelSuffix"
    :require-asterisk-position="requireAsteriskPosition"
    :hide-required-asterisk="hideRequiredAsterisk"
    :scroll-into-view-options="scrollIntoViewOptions"
    :scroll-to-error="scrollToError"
    :show-message="showMessage"
    :size="size"
    :status-icon="statusIcon"
    :validate-on-rule-change="validateOnRuleChange"
    @submit.prevent
  >
    <el-row :gutter="20">
      <template v-for="item in formSchemaes" :key="item.key">
        <el-col v-show="!inline ? true : fieldsIsCollapsedMap[item.key]" v-bind="item.col">
          <slot :name="item.key" :field="item">
            <form-item v-bind="item" :prop="item.key"></form-item>
          </slot>
        </el-col>
      </template>
      <slot></slot>

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
import { ElForm } from 'element-plus'
import { createFormContext } from './provider'
import FormAction from './form-action.vue'
import FormItem from './form-item.vue'

defineOptions({
  name: 'ProForm'
})

const props = defineProps(formProps)

const emits = defineEmits(formEmits)

const {
  formSchemaes,
  advanceState,
  formModel,
  setFormRef,
  validate,
  resetFields,
  toggleCollapse,
  formExposeMethods,
  fieldsIsCollapsedMap,
  advancedSpanColAttrs,
  getFieldValue,
  setFieldValue
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

createFormContext({
  submit,
  reset,
  toggleCollapse,
  getFieldValue,
  setFieldValue
})

defineExpose(formExposeMethods)
</script>

<style lang="scss" scoped></style>
