<template>
  <el-dialog
    v-model="dialogVisible"
    :title="getTitle"
    :width="width"
    :before-close="beforeClose"
    @open="openDialog"
    @close="closeDialog"
  >
    <Form
      ref="formInstance"
      v-loading="loading"
      v-bind="{ ...$attrs }"
      :form="getForm"
      :default-value="getFormDefaultValue"
      @submit="search"
      @cancel="cancel"
    >
      <template v-for="item in getForm.filter(f => f.slot)" #[item.key]="config" :key="item.key">
        <slot v-bind="{ ...item, ...config }" :name="item.key"></slot>
      </template>
    </Form>
  </el-dialog>
</template>
<script lang="ts">
export default {
  name: 'QsFormModal'
}
</script>

<script setup lang="ts">
import { computed, reactive, toRefs, ref } from 'vue'
import { buildProps } from './props'

import { ElMessage } from 'element-plus'
import Form from '../Form/Form.vue'

interface ReactiveType {
  dialogVisible: boolean
  loading: boolean
  title: string
  id: number | string | null
  formDefaultValue: Record<string, any>
}

const props = defineProps(buildProps)

const emits = defineEmits<{
  (e: 'cancel'): void
  (e: 'reload'): void
  (e: 'open'): void
  (e: 'beforeClose'): void
}>()

const formInstance = ref<typeof Form>()

const state = reactive<ReactiveType>({
  dialogVisible: false,
  formDefaultValue: {},
  loading: false,
  title: '新增',
  id: null
})

const { dialogVisible, loading, formDefaultValue } = toRefs(state)

const getForm = computed(() => props.form.filter(item => !item.isRender))

const getFormDefaultValue = computed(() =>
  Object.assign({}, props.defaultValue, state.formDefaultValue)
)

// 判断 title 采用哪一个title
const getTitle = computed(() => {
  if (!state.id) return props.addTitle || state.title
  if (state.id) return props.editTitle || props.addTitle || state.title

  return state.title
})

// 显示
const show = (id: string | number | null) => {
  state.dialogVisible = true
  state.id = id

  if (props.httpDetails && id) {
    state.loading = true
    props
      .httpDetails(id)
      .then(res => {
        state.formDefaultValue = res.data || {}
        state.loading = false
      })
      .catch(() => {
        state.loading = false
      })
  }
}

//
const closeDialog = () => {
  cancel()
}

const beforeClose = () => {
  resetFieldsValue()
  emits('beforeClose')
  initilize()
}

const openDialog = () => {
  emits('open')
}

// 搜索
const search = async (val: any) => {
  state.loading = true
  if (!state.id) {
    if (!props.httpAdd) return console.warn('no add http')

    props
      .httpAdd(props.handler({ ...props.defaultValue, ...val }))
      .then(res => {
        ElMessage.success(res.msg)
        reload()
        initilize()
        resetFieldsValue()
      })
      .catch(() => {
        state.loading = false
      })
  } else {
    if (!props.httpEdit) return console.warn('no edit http')

    props
      .httpEdit(state.id, props.handler({ ...props.defaultValue, ...val }))
      .then(res => {
        ElMessage.success(res.msg)
        reload()
        initilize()
        resetFieldsValue()
      })
      .catch(() => {
        state.loading = false
      })
  }
}

const cancel = () => {
  initilize()
  emits('cancel')
}

const reload = () => {
  emits('reload')
}

const resetFieldsValue = () => {
  formInstance.value?.resetFieldsValue()
}

const initilize = () => {
  state.loading = false
  state.dialogVisible = false
  state.formDefaultValue = {}
  state.title = '新增'
}

defineExpose({
  show,
  resetFieldsValue
})
</script>
