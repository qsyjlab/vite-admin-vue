<template>
  <el-button type="primary" @click="open">新增表单</el-button>

  <el-drawer v-model="drawer" :title="title" :direction="direction">
    <template #header>
      <div style="flex: auto"></div>
    </template>
    <base-form :fields="fields" @register="register" />
    <template #footer>
      <div>
        <el-button>取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import BaseForm from '../../form.vue'
import { useProForm } from '../../use-pro-form'
import drawerModalProps from './props'

defineProps(drawerModalProps)
const emits = defineEmits({
  submit: (values: Record<string, any>, done: () => void) => values && done
})

const { register, validate, resetFields } = useProForm()

const drawer = ref(false)

const submit = () => {
  validate(model => {
    function done() {
      close()
    }
    // TODO: 关于 此处拷贝应从 base-form 处处理
    emits('submit', { ...model }, done)
  })
}

const open = () => {
  drawer.value = true
}
const close = () => {
  drawer.value = false
  resetFields()
}

defineExpose({
  register,
  close
})
</script>
<style scoped></style>
