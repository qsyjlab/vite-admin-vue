<template>
  <el-select
    v-bind="$attrs"
    :model-value="modelValue"
    :clearable="clearable"
    :multiple="multiple"
    @change="changeHandler"
  >
    <template v-if="group">
      <el-option-group
        v-for="group in (options as ProSelectGroupOption[])"
        :key="group.key"
        :label="group.label || ''"
        ><el-option
          v-for="option in group.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
          :disabled="option.disabled"
        >
          <slot v-bind="option"></slot>
        </el-option>
      </el-option-group>
    </template>

    <template v-else>
      <el-option
        v-for="option in (options as ProSelectOption[])"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      >
        <slot v-bind="option"></slot>
      </el-option>
    </template>
  </el-select>
</template>
<script setup lang="ts">
import { ElSelect, ComponentSize } from 'element-plus'

type SelectInstance = InstanceType<typeof ElSelect>

interface ProSelectOption {
  key: string | number
  label: string
  value: string | number
  disabled?: boolean
}

interface ProSelectGroupOption {
  label: ProSelectOption['label']
  key: ProSelectOption['key']
  options: ProSelectOption[]
}

type ModelValue = ProSelectOption['value'] | ProSelectOption['value'][]

interface ProSelectProps {
  modelValue?: ModelValue
  options: ProSelectOption[] | ProSelectGroupOption[]
  size?: ComponentSize
  multiple?: SelectInstance['multiple']
  clearable?: SelectInstance['clearable']
  onChange?: (...args: any[]) => void
  /** @description 是否开始分组 */
  group?: boolean
}

defineOptions({
  name: 'ProSelect'
})

defineSlots<{
  default: (scope: ProSelectOption) => void
}>()

withDefaults(defineProps<ProSelectProps>(), {
  options: () => [],
  clearable: true,
  group: false
})

const emits = defineEmits<{
  'update:model-value': [...rest: any[]]
  change: [...rest: any[]]
}>()

const changeHandler: SelectInstance['onChange'] = (...rest) => {
  emits('update:model-value', rest[0])
  emits('change', ...rest)
}
</script>
<style scoped></style>