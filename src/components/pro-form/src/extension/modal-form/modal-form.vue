<template>
  <el-button type="primary" @click="dialogVisible = true">新增表单</el-button>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    append-to-body
    :close-on-click-modal="false"
    :draggable="false"
  >
    <template #header>
      <slot name="title"> {{ title }} </slot>
    </template>
    <base-form :fields="fields" @register="register"></base-form>

    <template #footer>
      <slot name="submitter">
        <span>
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="confirm" :loading="loading"> 确定 </el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>
<script lang="ts">
export default { name: 'VModalForm' }
</script>

<script setup lang="ts">
import { ref } from 'vue'
import BaseForm from '../../base-form.vue'
import { useProForm } from '../../use-pro-form'
import { modalProps } from './modal-form'

defineProps(modalProps)

const emits = defineEmits({
  submit: (values: Record<string, any>, done: () => void) => values && done
})

const { register, resetFields, validate } = useProForm()

const dialogVisible = ref(true)
const loading = ref(false)

const show = () => {
  resetFields()
  dialogVisible.value = true
}

const close = () => {
  dialogVisible.value = false
  resetFields()
}

const confirm = () => {
  validate(model => {
    function done() {
      close()
    }

    emits('submit', { ...model }, done)
  })
}

const modalFormMethods = {
  show,
  confirm,
  close
}

defineExpose(modalFormMethods)
</script>
<style scoped></style>
