<template>
  <el-form
    v-bind="{ ...$attrs }"
    :ref="ref => setFormRef(ref as ElFormInstance | null)"
    :inline="inline"
    :model="formModel"
    :label-width="resolvedLabelWidth"
    :label-position="resolvedLabelPosition"
    :disabled="disabled || loading"
    :inline-message="inlineMessage"
    :label-suffix="labelSuffix"
    :require-asterisk-position="requireAsteriskPosition"
    :hide-required-asterisk="hideRequiredAsterisk"
    :scroll-into-view-options="scrollIntoViewOptions"
    :scroll-to-error="scrollToError"
    :show-message="showMessage"
    :size="resolvedSize"
    :status-icon="statusIcon"
    :validate-on-rule-change="validateOnRuleChange"
    @submit.prevent
  >
    <form-layout-wrapper :layout="layout" :gutter="20">
      <template v-for="item in formSchemaes" :key="item.key">
        <form-schema-item
          :schema="item"
          :layout="layout"
          :collapse-visible="layout ? fieldsIsCollapsedMap[item.key] : true"
        >
          <slot name="field" :field="item" :model="formModel">
            <slot :name="item.key" :field="item" :model="formModel">
              <form-item v-bind="item" :prop="item.name ?? item.key" />
            </slot>
          </slot>
        </form-schema-item>
      </template>

      <form-item-layout-wrapper v-if="hasSubmitter" :layout="layout" v-bind="submitterColAttrs">
        <slot
          name="submitter"
          :submit="submit"
          :reset="reset"
          :collapsed="collapsed"
          :can-collapse="canCollapse"
          :toggle-collapse="toggleCollapse"
        >
          <form-action
            :config="submitterConfig"
            :collapsed="collapsed"
            :hidden-collapse-button="!layout || !canCollapse"
          />
        </slot>
      </form-item-layout-wrapper>
    </form-layout-wrapper>
  </el-form>
</template>

<script setup lang="ts" generic="TModel extends FormModel = FormModel">
import { computed } from 'vue'
import { ElForm, type FormInstance as ElFormInstance } from 'element-plus'
import { useProConfigProvider } from '../../pro-config-provider'
import { type FormEmit, type NormalizedFormProps } from './form-props'
import { useForm } from './form'
import { createFormContext } from './provider'
import FormAction from './form-action.vue'
import FormItem from './form-item.vue'
import FormSchemaItem from './form-schema-item.vue'
import FormLayoutWrapper from './form-layout-wrapper.vue'
import FormItemLayoutWrapper from './form-item-layout-wrapper.vue'
import type { FormModel, FormSchema, ProFormProps } from './types/form'

defineOptions({
  name: 'ProForm'
})

const props = withDefaults(defineProps<ProFormProps<TModel>>(), {
  fields: () => [],
  model: () => ({}) as TModel,
  inline: false,
  enableEffect: false,
  layout: true,
  submitter: undefined,
  collapsible: true,
  collapsed: undefined,
  defaultCollapsed: false,
  collapsedRows: () => ({ xs: 2, sm: 1 }),
  expandOnInvalid: true,
  autoRequest: true
})

const emits = defineEmits<FormEmit<TModel>>()
const proConfig = useProConfigProvider()
const resolvedSize = computed(
  () => props.size ?? proConfig.value.form?.size ?? proConfig.value.size
)
const resolvedLabelPosition = computed(
  () => props.labelPosition ?? proConfig.value.form?.labelPosition
)
const resolvedLabelWidth = computed(() => props.labelWidth ?? proConfig.value.form?.labelWidth)

defineSlots<{
  field?: (scope: { field: FormSchema<TModel>; model: TModel }) => unknown
  submitter?: (scope: {
    submit: () => Promise<boolean>
    reset: () => void
    collapsed: boolean
    canCollapse: boolean
    toggleCollapse: () => void
  }) => unknown
}>()

const {
  formSchemaes,
  canCollapse,
  collapsed,
  formModel,
  hasSubmitter,
  submitterConfig,
  submit,
  reset,
  setFormRef,
  toggleCollapse,
  formExposeMethods,
  fieldsIsCollapsedMap,
  submitterColAttrs,
  getFieldValue,
  setFieldValue,
  fieldVisibilityMap,
  getFieldError,
  loading
} = useForm<TModel>({
  props: props as NormalizedFormProps<TModel> & { fields: FormSchema<TModel>[] },
  emits
})

createFormContext({
  formModel,
  submit,
  reset,
  toggleCollapse,
  getFieldValue,
  setFieldValue,
  setFieldVisibility: (key, visible) => {
    fieldVisibilityMap[String(key)] = visible
  },
  removeFieldVisibility: key => {
    delete fieldVisibilityMap[String(key)]
  },
  getFieldError
})

defineExpose(formExposeMethods)
</script>

<style lang="scss" scoped>
:deep(.el-col) {
  .el-form-item {
    width: 100% !important;
  }
}
</style>
