<template>
  <el-form
    v-bind="{ ...$attrs }"
    :ref="ref => setFormRef(ref)"
    :inline="inline"
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
    <form-layout-wrapper :layout="layout" :gutter="20">
      <template v-for="item in formSchemaes" :key="item.key">
        <form-item-layout-wrapper
          v-if="layout ? fieldsIsCollapsedMap[item.key] : true"
          v-bind="item.col"
          :layout="layout"
        >
          <slot :name="item.key" :field="item">
            <form-item v-bind="item" :prop="item.key"></form-item>
          </slot>
        </form-item-layout-wrapper>
      </template>

      <form-item-layout-wrapper v-if="inline" :layout="layout" v-bind="advancedSpanColAttrs">
        <form-action
          :collapsed="advanceState.isAdvanced"
          :hidden-collapse-button="!layout || advanceState.hideAdvanceBtn"
        ></form-action>
      </form-item-layout-wrapper>
    </form-layout-wrapper>
  </el-form>
</template>

<script setup lang="ts">
import { toRaw } from 'vue'
import { ElForm } from 'element-plus'
import { formProps, formEmits, emitsEnums } from './form-props'
import { useForm } from './form'
import { createFormContext } from './provider'
import FormAction from './form-action.vue'
import FormItem from './form-item.vue'
import FormLayoutWrapper from './form-layout-wrapper.vue'
import FormItemLayoutWrapper from './form-item-layout-wrapper.vue'

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
    emits(emitsEnums.SUBMIT, toRaw(formModel.value))
  })
}

const reset = () => {
  resetFields(() => {
    emits(emitsEnums.RESET, toRaw(formModel.value))
  })
}

createFormContext({
  formModel,
  submit,
  reset,
  toggleCollapse,
  getFieldValue,
  setFieldValue
})

defineExpose(formExposeMethods)
</script>

<style lang="scss" scoped>
:deep(.el-form) {
  .el-col {
    .el-form-item {
      width: 100% !important;
    }
  }
}
</style>
