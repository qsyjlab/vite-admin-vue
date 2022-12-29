<template>
  <div>
    <el-form
      v-bind="{ ...$attrs }"
      :inline="inline"
      :model="formModel"
      :rules="formRules"
      :ref="ref => setFormRef(ref)"
      @submit.prevent
    >
      <template v-for="(item, index) in fields" :key="`${item.key}-${index}`">
        <el-form-item :label="item.label" :prop="item.key || String(index)">
          <component :is="item.el" v-model="formModel[item.key]" v-bind="handleElAttrs(item)" />
        </el-form-item>
      </template>

      <template v-if="inline">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </template>

      <template v-if="!inline">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="onReset">取消</el-button>
        </el-form-item>
      </template>
      <template v-if="inline && $slots.extra">
        <el-form-item> <slot name="extra" /> </el-form-item
      ></template>
    </el-form>
  </div>
</template>

<script lang="tsx">
export default {
  name: 'VProForm'
}
</script>

<script setup lang="tsx">
import { formProps, formEmits, emitsEnums } from './form-props'
import { useForm } from './form'

import { ElForm, ElFormItem } from 'element-plus'

const props = defineProps(formProps)

const emits = defineEmits(formEmits)

const { formModel, formRules, handleElAttrs, setFormRef, validate, reset } = useForm({
  props,
  emits
})

const onSubmit = () => {
  validate(() => {
    emits(emitsEnums.SUBMIT, formModel)
  })
}

const getValues = () => {
  return formModel
}

const onReset = () => {
  reset(() => {
    emits(emitsEnums.RESET, formModel)
  })
}

defineExpose({
  submit: onSubmit,
  reset: onReset,
  getValues,
  validate
})
</script>
