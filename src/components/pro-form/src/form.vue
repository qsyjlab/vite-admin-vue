<template>
  <el-form
    v-bind="{ ...$attrs }"
    :inline="inline"
    :model="formModel"
    :rules="formRules"
    :ref="ref => setFormRef(ref)"
    @submit.prevent
  >
    <template v-if="grid">
      <el-row>
        <el-col
          v-for="(item, index) in fields"
          v-bind="item.col"
          :key="`${item.key}`"
          v-show="fieldsIsCollapsedMap[item.key]"
        >
          <el-form-item :label="item.label" :prop="item.key || String(index)">
            <component :is="item.el" v-model="formModel[item.key]" v-bind="handleElAttrs(item)" />
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <template v-else>
      <template v-for="(item, index) in fields" :key="`${item.key}`">
        <el-form-item :label="item.label" :prop="item.key || String(index)">
          <component :is="item.el" v-model="formModel[item.key]" v-bind="handleElAttrs(item)" />
        </el-form-item>
      </template>
    </template>

    <template v-if="inline">
      <div style="display: flex; justify-content: flex-end; width: 100%">
        <el-space>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onReset">重置</el-button>
          <toggle-arrow :expand="advanceState.isAdvanced" @click="toggleCollapse"></toggle-arrow>
        </el-space>
      </div>
    </template>

    <template v-if="!inline">
      <el-form-item>
        <div style="display: flex; justify-content: center; width: 100%">
          <el-button @click="onReset">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
      </el-form-item>
    </template>
  </el-form>
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
import ToggleArrow from './components/toggle-arrow.vue'

const props = defineProps(formProps)

const emits = defineEmits(formEmits)

const {
  advanceState,
  formModel,
  formRules,
  handleElAttrs,
  setFormRef,
  validate,
  reset,
  toggleCollapse,
  fieldsIsCollapsedMap
} = useForm({
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
