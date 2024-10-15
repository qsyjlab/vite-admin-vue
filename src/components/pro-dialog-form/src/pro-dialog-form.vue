<template>
  <el-dialog v-model="dialogVisible" v-bind="dynamicDialogProps">
    <ProForm v-bind="dynamicFormProps" @register="register" />
    <template #footer>
      <slot name="footer" v-bind="{ submit, close }">
        <el-button @click="close">{{ cancelText }}</el-button>
        <el-button type="primary" :loading="loading" @click="submit">{{ confirmText }}</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ProForm, useProForm } from '@/components'
import { IDialogFormProps } from './types'
import { computed, nextTick, ref, reactive } from 'vue'
import { omit } from 'lodash-es'
import { inject } from 'vue'
import { proConfigProviderContextKey } from '@/components/pro-config-provider/src/token'

defineOptions({
  name: 'ProDialogForm'
})

type _ID = number | string
interface IState {
  id?: _ID
}

const DEFUALT_DIALOG_PROPS: IDialogFormProps['dialogProps'] = {
  closeOnPressEscape: true,
  appendToBody: true,
  showClose: true,
  modal: true
}

const props = withDefaults(defineProps<IDialogFormProps>(), {
  cancelText: '取消',
  confirmText: '提交',
  showMessage: true,
  inlineMessage: true,
  scrollToError: true,
  dialogProps: () => ({})
})

const emits = defineEmits(['success', 'error'])

const providerContext = inject(proConfigProviderContextKey, {})

const dialogVisible = ref(false)

const loading = ref(false)

const dialogCommand = {
  show: () => {
    dialogVisible.value = true
  },
  close: () => {
    dialogVisible.value = false
  }
}

const state = reactive<IState>({
  id: undefined
})

const { register, clearValidate, resetFields, forceUpdateModel, validate, formInstance } =
  useProForm()

const dynamicDialogProps = computed(() => {
  const title = state.id ? props.editTitle : props.addTitle || props.title
  return {
    ...DEFUALT_DIALOG_PROPS,
    ...props.dialogProps,
    title
  }
})

const dynamicFormProps = computed(() => {
  return omit(props, ['addRequest', 'editRequest', 'getRequest', 'onSuccess', 'dialogProps'])
})

const show = async (id?: _ID, defaultValue?: Record<string, any>) => {
  dialogCommand.show()
  await nextTick()
  resetFields()
  clearValidate()
  forceUpdateModel(defaultValue || {})

  state.id = id
  id &&
    props?.getRequest?.(id).then(res => {
      if (providerContext?.responseHandler) {
        forceUpdateModel(providerContext.responseHandler(res))
      } else {
        forceUpdateModel(res)
      }
    })
}

function close() {
  _reset()
  dialogCommand.close()
}

async function _reset() {
  state.id = undefined
  await nextTick()
  resetFields()
  clearValidate()
}

const submit = () => {
  const handler = createRequestHandler()
  validate(model => {
    if (state.id) {
      props
        ?.editRequest?.(state.id, handler(model))
        .then((...res) => {
          emits('success', ...res)

          close()
        })
        .catch(err => {
          emits('error', err)
        })
    } else {
      props
        ?.addRequest?.(handler(model))
        .then((...res) => {
          emits('success', ...res)
          close()
        })
        .catch(err => {
          emits('error', err)
        })
    }
  })
}

function createRequestHandler() {
  if (props.handler) return props.handler

  return data => data
}

defineExpose(
  reactive({
    show,
    close,
    formInstance
  })
)
</script>

<style scoped></style>
