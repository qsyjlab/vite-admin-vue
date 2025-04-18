<template>
  <el-select
    v-bind="$attrs"
    :key="flushKey"
    :model-value="modelValue"
    :clearable="clearable"
    :filterable="filterable"
    :remote="remote"
    :remote-method="customRemoteMehotd"
    :multiple="multiple"
    :loading="loading"
    :size="size"
    @change="changeHandler"
  >
    <template v-if="group">
      <el-option-group
        v-for="groupItem in cahceOptions"
        :key="groupItem[mergedFields.value]"
        :label="groupItem.label || ''"
        ><el-option
          v-for="option in groupItem.options"
          :key="option[mergedFields.value]"
          :label="option[mergedFields.label]"
          :value="option[mergedFields.value]"
          :disabled="option.disabled"
        >
          <slot v-bind="option"></slot>
        </el-option>
      </el-option-group>
    </template>

    <template v-else>
      <el-option
        v-for="option in cahceOptions"
        :key="option[mergedFields.value]"
        :label="option[mergedFields.label]"
        :value="option[mergedFields.value]"
        :disabled="option.disabled"
      >
        <slot v-bind="option"></slot>
      </el-option>
    </template>
  </el-select>
</template>
<script setup lang="ts">
import { isFunction } from '@/utils'
import { ElSelect, ComponentSize } from 'element-plus'
import { useThrottleFn } from '@vueuse/core'
import { watch } from 'vue'
import { ref } from 'vue'
import { computed } from 'vue'

type SelectInstance = InstanceType<typeof ElSelect>

type ProSelectOption = Record<string, any>

type ModelValue = any

interface Fields {
  label: string
  value: string
  options: string
}

interface ProSelectProps {
  modelValue?: ModelValue
  options?: ProSelectOption[]
  size?: ComponentSize
  multiple?: boolean
  clearable?: boolean
  remote?: boolean
  onChange?: (...args: any[]) => void
  /** @description 是否开始分组 */
  group?: boolean
  /** @description 用于替换默认取值下标 */
  fields?: Partial<Fields>
  filterable?: boolean
  paramns?: Record<string, any>
  request?: (paramns: Record<string, any>) => Promise<ProSelectOption[]>
  remoteMethod?: SelectInstance['remoteMethod']
}

defineOptions({
  name: 'ProSelect'
})

defineSlots<{
  default: (scope: ProSelectOption) => void
}>()

const DefaultFields: Fields = {
  label: 'label',
  value: 'value',
  options: 'options'
}

const props = withDefaults(defineProps<ProSelectProps>(), {
  options: () => [],
  clearable: true,
  group: false,
  fields: () => ({}),
  filterable: false,
  paramns: () => ({})
})
const emits = defineEmits<{
  'update:model-value': [...rest: any[]]
  change: [...rest: any[]]
}>()

const cahceOptions = ref<ProSelectOption[]>([])
const loading = ref(false)
const flushKey = ref()

const fetchOptionsFn = useThrottleFn((...parmas) => {
  // do something, it will be called at most 1 time per second
  fetchOptions(...parmas)
}, 50)

watch(
  () => props.options,
  () => {
    cahceOptions.value = props.options
  },
  {
    immediate: true
  }
)

watch(
  () => props.multiple,
  () => {
    flushKey.value = new Date().getTime()
    emits('update:model-value', undefined)
  }
)

if (props.paramns && props.request) {
  watch(
    () => props.paramns,
    () => {
      fetchOptionsFn()
    },
    {
      immediate: true
    }
  )
}

const mergedFields = computed(() => Object.assign({}, DefaultFields, props.fields))

const changeHandler: SelectInstance['onChange'] = (...rest) => {
  emits('update:model-value', rest[0])
  emits('change', ...rest)
}

const customRemoteMehotd = query => {
  fetchOptionsFn({
    _keyworkd: query
  })
}

function fetchOptions(query = {}) {
  console.log('query')

  if (props.request && isFunction(props.request)) {
    loading.value = true
    props
      .request({
        ...props.paramns,
        ...query
      })
      .then(res => {
        cahceOptions.value = res
      })
      .catch(() => {
        cahceOptions.value = []
      })
      .finally(() => {
        loading.value = false
      })
  }
}
</script>
<style scoped></style>
