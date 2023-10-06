<template>
  <el-form
    v-bind="{ ...$attrs }"
    :inline="inline"
    :model="formModel"
    :rules="formRules"
    :ref="ref => setFormRef(ref)"
    @submit.prevent
  >
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in formSchemaes"
        v-bind="item.col"
        :key="`${item.key}`"
        v-show="!inline ? true : fieldsIsCollapsedMap[item.key]"
      >
        <el-form-item style="width: 100%" :label="item.label" :prop="item.key || String(index)">
          <component
            :is="item.el"
            v-model="formModel[item.key]"
            v-bind="handleElAttrs(item)"
            v-on="item.events || {}"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="advancedSpanColAttrs">
        <template v-if="inline">
          <div style="display: flex; justify-content: flex-end; width: 100%">
            <el-space>
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="onReset">重置</el-button>
              <toggle-arrow
                v-if="!advanceState.hideAdvanceBtn"
                :expand="advanceState.isAdvanced"
                @click="toggleCollapse"
              ></toggle-arrow>
            </el-space>
          </div>
        </template>
      </el-col>
    </el-row>

    <!-- 只提供 inline 模式下的操作按钮 -->
  </el-form>
</template>

<script lang="ts">
export default {
  name: 'ProForm'
}
</script>

<script setup lang="ts">
import { formProps, formEmits, emitsEnums } from './form-props'
import { useForm } from './form'
import { ElForm, ElFormItem } from 'element-plus'
import ToggleArrow from './components/toggle-arrow.vue'

defineOptions({
  name: 'ProForm'
})

const props = defineProps(formProps)

const emits = defineEmits(formEmits)

const {
  formSchemaes,
  advanceState,
  formModel,
  formRules,
  handleElAttrs,
  setFormRef,
  validate,
  resetFields,
  toggleCollapse,
  formExposeMethods,
  fieldsIsCollapsedMap,
  advancedSpanColAttrs
} = useForm({
  props,
  emits
})

const onSubmit = () => {
  validate(() => {
    emits(emitsEnums.SUBMIT, formModel)
  })
}

const onReset = () => {
  resetFields(() => {
    emits(emitsEnums.RESET, formModel)
  })
}

defineExpose(formExposeMethods)
</script>
