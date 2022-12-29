<template>
  <div>
    <ElForm
      v-if="form.length !== 0"
      ref="uiForm"
      :inline="inline"
      :model="query"
      :rules="rules"
      :size="size"
      v-bind="{ ...$attrs, ...{ labelWidth: inline ? undefined : labelWidth } }"
      @submit.prevent
    >
      <ElFormItem v-for="item in form" :key="item.key" :label="item?.label" :prop="item.key">
        <!-- 默认情况下 -->
        <span v-if="item.tag">
          <component
            :is="item.tag"
            v-model="query[item.key]"
            v-bind="{
              ...item?.attrs,
              ...{
                placeholder: handlePlaceholder(item) ? handlePlaceholder(item) : undefined
              }
            }"
          >
          </component>
        </span>

        <template v-else>
          <slot :name="item?.slot" v-bind="{ ...item }"></slot>
        </template>
      </ElFormItem>
      <ElFormItem>
        <div :class="!inline ? ['form-layout', 'form-layout-vertical'] : ['form-layout']">
          <div :class="['basic_button', extraFixed === 'right' ? 'extra-flex-right' : '']">
            <div v-if="confirmButton" class="ui-form-search">
              <slot name="submit" :confirm="handleSearch">
                <ElButton v-if="!inline" type="primary" @click="handleSearch">{{
                  confirmText || '确认'
                }}</ElButton>
                <ElButton v-else type="primary" @click="handleSearch">{{
                  confirmText || '搜索'
                }}</ElButton>
              </slot>
            </div>

            <div class="ui-form-reset">
              <slot name="cancel" :cancel="handleReSet">
                <ElButton v-if="!inline" :size="size" @click="handleReSet">{{
                  cancelText || '取消'
                }}</ElButton>
                <ElButton v-else :size="size" @click="handleReSet">{{
                  cancelText || '重置'
                }}</ElButton>
              </slot>
            </div>
          </div>
        </div>
      </ElFormItem>
      <!-- 额外按钮插槽 -->
      <ElFormItem style="float: right">
        <div v-if="inline" class="ui-form-extra">
          <slot name="extra"> </slot>
        </div>
      </ElFormItem>
    </ElForm>
  </div>
</template>
<script lang="ts">
interface reactiveType {
  query: { [propName: string]: any }
  formLayout: { [propName: string]: any }
  rules: { [propName: string]: any }
}

export default {
  name: 'QsForm'
}
</script>

<script setup lang="ts">
import { ElForm } from 'element-plus'
import { buildProps } from './form'
import { computed, nextTick, onBeforeMount, reactive, ref, toRefs, watch } from 'vue'

const props = defineProps(buildProps)

const emit = defineEmits<{
  (e: 'submit', value: any): any
  (e: 'cancel', value: any): any
}>()

const uiForm = ref<typeof ElForm>()

const state = reactive<reactiveType>({
  query: {},
  formLayout: {},
  rules: {}
})

const { query, rules } = toRefs(state)

// created
onBeforeMount(async () => {
  await initializeForm()
  await initializeFormValue()
})

// 监听默认值改变
watch(
  () => props.defaultValue,
  (newVal, old) => {
    if (JSON.stringify(newVal) !== JSON.stringify(old)) {
      props.form.forEach(item => {
        state.query[item.key] = props.defaultValue[item.key]
      })
    }
  },
  {
    deep: true
  }
)

// 初始化表单
const initializeForm = () => {
  if (props.form.length === 0) return
  props.form.forEach(item => {
    state.query[item.key] = undefined
    state.rules[item.key] = item?.rules ? item?.rules : []
  })
}

// 初始化表单默认值
const initializeFormValue = () => {
  nextTick(() => {
    props.form.forEach(item => {
      state.query[item.key] = props.defaultValue[item.key]
      // state.rules[item.key] = item?.rules ? item?.rules : []
    })
  })
}

// 重置
const handleReSet = async () => {
  // await initializeForm()
  uiForm.value?.resetFields()
  emit('cancel', state.query)
}

// 强制拉出值 为 和 dialog 共用 强制获取
const getValue = () => {
  emit('submit', state.query)
}

// 处理不需要placeholder部分
const handlePlaceholder = computed(() => (item: any) => {
  if (typeof item?.attrs?.placeholder === 'boolean' && item.attrs.placeholder === false)
    return false

  return item.label
})

// 搜索
const handleSearch = () => {
  uiForm.value?.validate((valid: boolean): void => {
    if (!valid) return

    uiForm.value?.clearValidate()
    emit('submit', state.query)
  })
}

defineExpose({
  handleReSet,
  handleSearch
})
</script>

<style lang="scss" scoped>
.form-layout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-layout-vertical {
  .basic_button {
    // margin-right: 0;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }
  .ui-form-search {
    margin-left: 10px;
    margin-right: 0;
  }
  .basic_button:first-child {
    margin-right: 0;
  }
}
.basic_button {
  display: flex;
  align-items: center;
}
.basic_button:first-child {
  margin-right: 10px;
}

.extra-flex-right {
  justify-content: flex-end;
}
.ui-form-search {
  margin-right: 10px;
}
</style>
