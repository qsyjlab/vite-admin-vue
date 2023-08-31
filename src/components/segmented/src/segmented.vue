<template>
  <div
    ref="segmentedRef"
    :class="[
      'segmented',
      block ? 'is-block' : '',
      size && size !== 'default' ? `segmented--${size}` : '',
      disabled ? 'is-disabled' : ''
    ]"
  >
    <div class="segmented-group">
      <div
        :class="[
          'segmented-item',
          selected === item.value ? 'is-selected' : '',
          disabled || item.disabled ? 'is-disabled' : ''
        ]"
        v-for="item in options"
        :key="item.value"
        @click="handleSelect(item)"
      >
        {{ item.label }}
      </div>
      <div ref="overlayRef" class="segmented-overlay"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, nextTick, unref, onMounted, onBeforeUnmount } from 'vue'

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

const selected = ref<SegmentedItem['value']>()

const segmentedRef = ref<HTMLDivElement>()
const overlayRef = ref<HTMLDivElement>()

let resizeObserver: ResizeObserver | null = null

let oldWidth = 0

onMounted(() => {
  if (!segmentedRef.value) return

  if ('ResizeObserver' in window && props.autoSize) {
    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect.width !== oldWidth) {
          update()
        }
      }
    })

    resizeObserver?.observe(segmentedRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal === oldVal) return

    selected.value = props.modelValue
    nextTick(() => {
      update()
    })
  },
  {
    immediate: true
  }
)

const handleSelect = (item: SegmentedItem) => {
  if (props.disabled || item.disabled) return

  selected.value = item.value
  update()
  updateModalValue()
}

function update() {
  nextTick(() => {
    if (!segmentedRef.value) return
    const selectedDom = segmentedRef.value.querySelector<HTMLDivElement>('.is-selected')
    const overlayStyle = unref(overlayRef)?.style
    if (overlayRef.value && selectedDom && overlayStyle) {
      overlayStyle.left = `${selectedDom.offsetLeft}px`
      overlayStyle.width = `${selectedDom.clientWidth}px`
    }
  })
}

function updateModalValue() {
  emits('update:model-value', selected.value)
  emits('change', selected.value)
}

defineExpose({
  update
})
</script>
<style lang="scss" scoped>
.segmented {
  --segmented-item-height: 32px;
  position: relative;
  display: inline-block;
  height: var(--segmented-item-height);

  padding: 2px;
  background-color: #f5f5f5;
  border-radius: 6px;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &--large {
    --segmented-item-height: 40px;
  }

  &--small {
    --segmented-item-height: 24px;
  }

  &.is-block {
    display: flex;

    .segmented-item {
      flex: 1;
    }
  }
  &.is-disabled {
    color: #d7d7d7;
    cursor: not-allowed;
  }

  &-group {
    position: relative;
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    color: rgba(0, 0, 0, 0.65);
    height: 100%;
    width: 100%;
  }

  &-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    border-radius: 6px;
    transition: left 0.3s ease-in-out, width 0.3s ease-in-out;
    background-color: #fff;
  }

  &-item {
    position: relative;
    min-height: var(--segmented-item-height);
    line-height: var(--segmented-item-height);
    padding: 0 11px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-radius: 4px;
    cursor: pointer;
    z-index: 2;
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

    &.is-selected {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02),
        0 2px 4px 0 rgba(0, 0, 0, 0.02);
      color: rgba(0, 0, 0, 0.88);
    }

    &.is-disabled {
      color: #d7d7d7;
      cursor: not-allowed;
    }

    &:hover:not(.is-selected, .is-disabled) {
      background-color: rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
