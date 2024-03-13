<template>
  <el-dialog v-model="dialogVisible" v-bind="dynamicDialogProps">
    <ProForm v-bind="dynamicFormProps" @register="register" />
    <template #footer>
      <slot name="footer" v-bind="{ submit, close }">
        <el-button @click="close">{{ cancelText }}</el-button>
        <el-button type="primary" @click="submit">{{ confirmText }}</el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ProForm, useProForm } from '@/components'
import { IDialogForm } from './types'
import { computed, nextTick, ref, reactive } from 'vue'
import { omit } from 'lodash-es'

type _ID = number | string
interface IState {
  id?: _ID
}

const DEFUALT_DIALOG_PROPS: IDialogForm['dialogProps'] = {
  closeOnPressEscape: true,
  appendToBody: true,
  showClose: true,
  modal: true
}

const props = withDefaults(defineProps<IDialogForm>(), {
  cancelText: '取消',
  confirmText: '提交',
  dialogProps: () => ({})
})

const emits = defineEmits(['success', 'error'])

const dialogVisible = ref(false)

const dialogCommand = {
  show: () => {
    dialogVisible.value = true
  },
  close: () => {
    dialogVisible.value = false
  }
}

const state: IState = {
  id: undefined
}

const { register, clearValidate, resetFields, forceUpdateModel, validate, formInstance } =
  useProForm()

const dynamicDialogProps = computed(() => {
  return {
    ...DEFUALT_DIALOG_PROPS,
    ...props.dialogProps
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
  id &&
    props?.getRequest?.(id).then(res => {
      forceUpdateModel(res)
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
  validate(model => {
    if (state.id) {
      props
        ?.editRequest?.(state.id, model)
        .then((...res) => {
          emits('success', ...res)
          close()
        })
        .catch(err => {
          emits('error', err)
        })
    } else {
      props
        ?.addRequest?.(model)
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

defineExpose(
  reactive({
    show,
    close,
    formInstance
  })
)
</script>

<style scoped></style>
