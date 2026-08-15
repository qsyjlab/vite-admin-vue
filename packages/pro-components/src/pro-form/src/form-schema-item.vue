<template>
  <form-item-layout-wrapper
    v-if="visible"
    v-show="collapseVisible"
    v-bind="schema.col"
    :layout="layout"
  >
    <slot :field="schema" :context="context" />
  </form-item-layout-wrapper>
</template>

<script setup lang="ts" generic="TModel extends FormModel = FormModel">
import { computed, onBeforeUnmount, watch } from 'vue'
import FormItemLayoutWrapper from './form-item-layout-wrapper.vue'
import { useFormContext } from './provider'
import type { FormFieldDependencyContext, FormModel, FormSchema } from './types/form'
import { useFormField } from './use-form-field'

const props = withDefaults(
  defineProps<{
    schema: FormSchema<TModel>
    layout?: boolean
    collapseVisible?: boolean
  }>(),
  {
    layout: true,
    collapseVisible: true
  }
)

defineSlots<{
  default?: (scope: {
    field: FormSchema<TModel>
    context: FormFieldDependencyContext<TModel>
  }) => unknown
}>()

const formContext = useFormContext<TModel>()
const visibilitySchema = computed(() => ({
  ...props.schema,
  dependencies: typeof props.schema.show === 'function' ? props.schema.dependencies : [],
  shouldUpdate: typeof props.schema.show === 'function' ? props.schema.shouldUpdate : undefined
}))
const { context, resolve } = useFormField<TModel>(visibilitySchema)
const visible = computed(() => resolve(props.schema.show, true))

watch(visible, value => formContext.setFieldVisibility(props.schema.key, value), {
  immediate: true
})

onBeforeUnmount(() => formContext.removeFieldVisibility(props.schema.key))
</script>
