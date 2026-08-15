<template>
  <el-form-item
    :prop="formProp"
    :required="isRequired"
    :rules="normalizedRules"
    :error="formContext.getFieldError(fieldName) || undefined"
  >
    <template v-if="label" #label>
      <span class="pro-form-item__label">
        <span>{{ label }}</span>
        <el-tooltip v-if="tip" :content="tip" placement="top">
          <el-icon class="pro-form-item__tip"><QuestionFilled /></el-icon>
        </el-tooltip>
      </span>
    </template>

    <slot>
      <pro-field
        v-if="(valueType || !el) && formContext"
        :model-value="formContext.getFieldValue(fieldName)"
        :mode="mode || 'edit'"
        :value-type="valueType || 'text'"
        :value-enum="valueEnum"
        :options="options"
        :option-fields="optionFields"
        :field-props="normalizedFieldProps"
        :style="fieldStyle"
        :data-pro-field="fieldKey"
        @update:model-value="value => formContext?.setFieldValue(fieldName, value)"
        v-on="events || {}"
      />

      <component
        :is="el"
        v-else-if="el && formContext"
        :model-value="formContext.getFieldValue(fieldName)"
        :style="fieldStyle"
        :data-pro-field="fieldKey"
        v-bind="normalizedAttrs"
        @update:model-value="value => formContext?.setFieldValue(fieldName, value)"
        v-on="events || {}"
      />
    </slot>
  </el-form-item>
</template>

<script
  setup
  lang="ts"
  generic="TModel extends FormModel = FormModel, TOption extends object = ProOption"
>
import { computed } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElFormItem, ElIcon, ElTooltip } from 'element-plus'
import { ProField } from '../../pro-field'
import type { ProOption } from '../../shared/pro-option'
import type { ProPath } from '../../shared/pro-path'
import { useFormContext } from './provider'
import type { FormModel, FormSchema } from './types/form'
import { useFormField } from './use-form-field'

type FormItemSchema = Omit<FormSchema<TModel, TOption>, 'key'> & {
  prop: FormSchema<TModel, TOption>['name'] | string | number
}

const props = withDefaults(defineProps<FormItemSchema>(), {
  events: () => ({}),
  attrs: () => ({}),
  fieldProps: () => ({}),
  options: () => [],
  required: undefined
})

const formContext = useFormContext<TModel>()
const fieldName = computed<ProPath>(() => props.prop as ProPath)
const fieldKey = computed(() =>
  Array.isArray(props.prop) ? props.prop.join('.') : String(props.prop)
)
const fieldSchema = computed(
  () =>
    ({
      ...props,
      key: String(props.prop),
      name: props.prop
    }) as unknown as FormSchema<TModel>
)
const { resolve } = useFormField<TModel>(fieldSchema)
const formProp = computed(() => (Array.isArray(props.prop) ? [...props.prop] : String(props.prop)))
const fieldStyle = computed(() => ({ width: props.fill ? '100%' : undefined }))
const resolvedFieldProps = computed(() => resolve(props.fieldProps, {}))

const resolvedDisabled = computed(() => {
  if (props.attrs.disabled !== undefined) return Boolean(props.attrs.disabled)
  if (resolvedFieldProps.value.disabled !== undefined) {
    return Boolean(resolvedFieldProps.value.disabled)
  }
  return resolve(props.disabled, false)
})

const normalizedAttrs = computed(() => ({
  placeholder: props.label,
  ...props.attrs,
  ...resolvedFieldProps.value,
  disabled: resolvedDisabled.value
}))

const normalizedFieldProps = computed(() => ({
  placeholder: props.label,
  ...props.attrs,
  ...resolvedFieldProps.value,
  disabled: resolvedDisabled.value
}))

const normalizedRules = computed(() => {
  const rules = [...resolve(props.rules, [])]

  if (props.required && !rules.some(rule => Object.hasOwn(rule, 'required'))) {
    rules.unshift({
      required: true,
      message: props.requiredMessage || '此项为必填'
    })
  }

  if (props.required !== undefined) {
    const requiredRules = rules
      .map((rule, index) => [rule, index] as const)
      .filter(([rule]) => Object.hasOwn(rule, 'required'))

    if (requiredRules.length) {
      requiredRules.forEach(([rule, index]) => {
        if (rule.required !== props.required) rules[index] = { ...rule, required: props.required }
      })
    } else {
      rules.push({ required: props.required })
    }
  }

  return rules
})

const isRequired = computed(() => normalizedRules.value.some(rule => rule.required))
</script>

<style lang="scss" scoped>
.pro-form-item__label {
  display: inline-flex;
  align-items: center;
  height: 100%;

  span {
    display: inline-block;
    margin-right: 3px;
  }
}
</style>
