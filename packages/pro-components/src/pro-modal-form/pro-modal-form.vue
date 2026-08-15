<template>
  <el-dialog
    v-model="visible"
    append-to-body
    destroy-on-close
    :title="currentTitle || title"
    :width="width"
    :close-on-click-modal="false"
    v-bind="dialogProps"
    :before-close="handleBeforeClose"
  >
    <slot name="before-form" />
    <pro-form
      ref="formRef"
      v-bind="formProps"
      :model="initialValues"
      :fields="fields"
      :disabled="Boolean(formProps.disabled || loadingData)"
    >
      <template v-for="(_, slotName) in $slots" #[slotName]="scope">
        <slot v-if="!reservedSlots.includes(String(slotName))" :name="slotName" v-bind="scope" />
      </template>
    </pro-form>
    <slot name="after-form" />

    <template #footer>
      <slot
        name="footer"
        :submit="submit"
        :close="close"
        :loading="loading"
        :loading-data="loadingData"
        :submitting="submitting"
      >
        <el-button :disabled="loading" @click="close">{{ cancelText }}</el-button>
        <el-button type="primary" :loading="loading" @click="submit">{{ confirmText }}</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" generic="TModel extends FormModel = FormModel, TResult = unknown">
import { computed, ref, useTemplateRef } from 'vue'
import { omit } from 'lodash-es'
import { ElButton, ElDialog } from 'element-plus'
import {
  ProForm,
  useProFormContainer,
  type FormMethodsType,
  type FormModel,
  type ProFormContainerOpenOptions
} from '../pro-form'
import type { ProModalFormExpose, ProModalFormProps } from './pro-modal-form'

defineOptions({ name: 'ProModalForm' })

const props = withDefaults(defineProps<ProModalFormProps<TModel, TResult>>(), {
  fields: () => [],
  initialValues: () => ({}) as TModel,
  inline: false,
  enableEffect: false,
  layout: true,
  submitter: false,
  collapsible: true,
  collapsed: undefined,
  defaultCollapsed: false,
  expandOnInvalid: true,
  disabled: false,
  statusIcon: false,
  showMessage: true,
  inlineMessage: false,
  hideRequiredAsterisk: false,
  validateOnRuleChange: true,
  scrollToError: false,
  title: '表单',
  width: '640px',
  cancelText: '取消',
  confirmText: '提交',
  closeOnSuccess: true,
  resetOnClose: true,
  preventCloseWhileSubmitting: true,
  warnWhenDirty: true,
  dialogProps: () => ({})
})
const emit = defineEmits<{
  success: [result: TResult | undefined, values: TModel]
  error: [error: unknown]
  open: [options: ProFormContainerOpenOptions<TModel>]
  close: []
}>()
const visible = defineModel<boolean>({ default: false })
const currentTitle = ref('')
const formRef = useTemplateRef<FormMethodsType<TModel>>('formRef')
const reservedSlots = ['before-form', 'after-form', 'footer']

const formProps = computed(() =>
  omit(props, [
    'initialValues',
    'onFinish',
    'load',
    'mapError',
    'beforeSubmit',
    'closeOnSuccess',
    'resetOnClose',
    'dialogProps',
    'title',
    'width',
    'cancelText',
    'confirmText',
    'beforeClose',
    'preventCloseWhileSubmitting',
    'warnWhenDirty',
    'dirtyConfirmMessage',
    'confirmDirtyClose'
  ])
)

const container = useProFormContainer<TModel, TResult>({
  visible,
  formRef,
  getBehavior: () => props,
  onOpen: options => {
    currentTitle.value = options.title || ''
    emit('open', options)
  },
  onSuccess: (result, values) => emit('success', result, values),
  onError: error => emit('error', error),
  onClose: () => emit('close')
})
const { loading, loadingData, submitting, result, open, close, submit, reset } = container

async function handleBeforeClose(done: () => void) {
  if (props.beforeClose && !(await props.beforeClose())) return
  if (await close()) done()
}

const exposed: ProModalFormExpose<TModel, TResult> = {
  getVisible: () => visible.value,
  getLoading: () => loading.value,
  getLoadingData: () => loadingData.value,
  getSubmitting: () => submitting.value,
  getForm: () => formRef.value,
  getResult: () => result.value,
  open,
  close,
  submit,
  reset
}

defineExpose(exposed)
</script>
