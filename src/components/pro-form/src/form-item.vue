<template>
  <el-form-item :prop="String(prop)" :required="isRequired" :rules="normalizedRules">
    <template v-if="label" #label>
      <span class="pro-form-item__label">
        <span> {{ label }}</span>
        <tips v-if="tip" class="pro-form-item__tip" :text="tip"></tips>
      </span>
    </template>
    <slot>
      <component
        :is="el"
        v-if="formContext"
        :model-value="formContext?.getFieldValue(prop)"
        :style="{
          width: fill ? '100%' : ''
        }"
        v-bind="normalizedAttrs"
        @update:model-value="value => formContext?.setFieldValue(prop, value)"
        v-on="events || {}"
      />
    </slot>
  </el-form-item>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ElFormItem } from 'element-plus'
import type { FormSchema } from './form-props'
import { useFormContext } from './provider'
import { Tips } from '../../tips'
import { isFunction } from 'lodash-es'
import { toRaw } from 'vue'

const props = withDefaults(defineProps<Omit<FormSchema, 'key'> & { prop: FormSchema['key'] }>(), {
  events: () => ({}),
  attrs: () => ({}),
  required: undefined
})

const formContext = useFormContext()

const normalizedAttrs = computed(() => {
  const { attrs = {}, label, disabled } = props
  return {
    placeholder: label,
    ...attrs,
    disabled:
      attrs.disabled !== undefined || attrs.disabled !== null
        ? isFunction(disabled)
          ? disabled?.(formContext?.getFieldValue(props.prop), toRaw(formContext.formModel.value))
          : disabled
        : attrs.disabled
  }
})

const normalizedRules = computed(() => {
  const { required, requiredMessage } = props

  const rules: FormSchema['rules'] = []

  // 如果 require 自动生成一个
  if (required) {
    rules.push({
      required,
      message: requiredMessage || '此项为必填'
    })
  }
  if (props.rules) {
    rules.push(...props.rules)
  }

  if (required !== undefined) {
    const requiredRules = rules
      .map((rule, i) => [rule, i] as const)
      .filter(([rule]) => Object.keys(rule).includes('required'))

    if (requiredRules.length > 0) {
      for (const [rule, i] of requiredRules) {
        if (rule.required === required) continue
        rules[i] = { ...rule, required }
      }
    } else {
      rules.push({ required })
    }
  }

  return rules
})

const isRequired = computed(() => normalizedRules.value.some(rule => rule.required))
</script>
<style lang="scss" scoped>
.pro-form-item {
  &__label {
    display: inline-flex;
    align-items: center;
    height: 100%;
    span {
      display: inline-block;
      margin-right: 3px;
    }
  }
}
</style>
