<script setup lang="ts">
import { useDialog } from '@/hooks/use-dialog'
import { ProForm, useProForm } from '@/components'
import { IDialogForm } from './types'

import { computed, nextTick } from 'vue'

interface IState {
  id?: _ID
}

const props = withDefaults(defineProps<IDialogForm>(), {
  appendToBody: true,
  showClose: true,
  modal: true,
  closeOnPressEscape: true,
  cancelText: '取消',
  confirmText: '提交'
})

const emits = defineEmits(['success', 'error'])

const state: IState = {
  id: undefined
}

type _ID = number | string

const [DialogTempalte, dialogCommand] = useDialog()
const { register, clearValidate, resetFields, forceUpdateModel, validate } = useProForm()

const dynamicDialogProps = computed(() => {
  const _props: any = {}
  Object.keys(props).forEach(key => {
    const _key = key as keyof typeof props
    if (props[_key] !== undefined) {
      _props[key] = props[_key]
    }
  })
  return {
    ..._props,
    formProps: undefined,
    fields: undefined
  }
})
const show = async (id?: _ID) => {
  dialogCommand.show()
  await nextTick()
  resetFields()
  clearValidate()
  id &&
    props?.getRequest?.(id).then(res => {
      forceUpdateModel(res)
    })
}

function close() {
  _reset()
  dialogCommand.close()
}

function _reset() {
  state.id = undefined
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

defineExpose({
  show,
  close
})
</script>

<template>
  <DialogTempalte v-bind="dynamicDialogProps">
    <ProForm :fields="fields" @register="register" />
    <template #footer>
      <el-button @click="close">{{ cancelText }}</el-button>
      <el-button type="primary" @click="submit">{{ confirmText }}</el-button>
    </template>
  </DialogTempalte>
</template>

<style scoped></style>
