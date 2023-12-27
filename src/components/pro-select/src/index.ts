import { defineComponent } from 'vue'
import Select from './pro-select.vue'
import { h, watch, ref } from 'vue'

export type ProSelectInstance = InstanceType<typeof Select>
export const ProSelect = defineComponent({
  name: Select.name,
  props: ['modelValue', 'multiple'],
  emits: ['update:modelValue'],
  setup(props, { attrs, slots, emit }) {
    const keyRef = ref(new Date().getTime())
    watch(
      () => props.multiple,
      () => {
        keyRef.value = new Date().getTime()
        emit('update:modelValue', undefined)
      }
    )
    return () => {
      return h(
        Select,
        {
          attrs,
          multiple: props.multiple,
          key: keyRef.value,
          modelValue: props.modelValue,
          'onUpdate:model-value': value => emit('update:modelValue', value)
        },
        slots
      )
    }
  }
}) as unknown as ProSelectInstance
