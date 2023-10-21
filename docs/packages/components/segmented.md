# Segmented 分段器

```ts
interface SegmentedItem {
  label: string
  value: string | number
  disabled?: boolean
}

const emits = defineEmits<{
  'update:model-value': [value: SegmentedItem['value'] | undefined]
  change: [value: SegmentedItem['value'] | undefined]
}>()

const props = withDefaults(
  defineProps<{
    modelValue?: SegmentedItem['value']
    options: SegmentedItem[]
    block?: boolean
    size?: 'large' | 'default' | 'small'
    disabled?: boolean
    autoSize?: boolean
  }>(),
  {
    autoSize: true
  }
)
```
