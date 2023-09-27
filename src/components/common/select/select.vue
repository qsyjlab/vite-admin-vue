<template>
  <el-select v-model="selected" v-bind="{ ...$attrs }" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item.key || item?.value.toString()"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script lang="ts">
export default defineComponent({
  name: 'QsSelect'
})
</script>

<script setup lang="ts">
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue'

type ModelValueType =
  | number
  | string
  | boolean
  | number[]
  | string[]
  | { [propName: string | number]: any }

interface SelectReactiveType {
  selected: ModelValueType
}

interface OptionsType {
  key: number | string
  label: string
  value: ModelValueType
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValueType): ModelValueType
}>()

const props = defineProps({
  modelValue: {
    type: [String, Boolean, Array, Number, Object] as PropType<ModelValueType>,
    default: (value: { modelValue: ModelValueType }) => {
      return value.modelValue
    }
  },
  options: {
    type: Array as PropType<OptionsType[]>,
    default: () => []
  }
})

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return
    state.selected = newVal
  }
)

const state = reactive<SelectReactiveType>({
  selected: props?.modelValue ? props.modelValue : []
})

// 处理change事件
const handleChange = (e: Event) => {
  emit('update:modelValue', e)
}

const { selected } = toRefs(state)
</script>

<style scoped></style>
