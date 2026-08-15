<template>
  <section
    ref="cardRef"
    class="pro-card"
    :class="[
      `is-shadow-${resolvedShadow}`,
      `is-${direction}`,
      {
        'is-bordered': resolvedBordered,
        'is-header-bordered': headerBordered,
        'is-split': split,
        'is-collapsed': effectiveCollapsed
      }
    ]"
  >
    <header v-if="hasHeader" class="pro-card__header">
      <div class="pro-card__heading">
        <slot name="title" :meta="meta">
          <div v-if="title" class="pro-card__title">{{ title }}</div>
        </slot>
        <slot name="subtitle" :meta="meta">
          <div v-if="subtitle" class="pro-card__subtitle">{{ subtitle }}</div>
        </slot>
      </div>
      <div class="pro-card__extra">
        <slot
          name="extra"
          :meta="meta"
          :collapsed="effectiveCollapsed"
          :toggle-collapse="toggleCollapse"
        />
        <el-tooltip v-if="resolvedCollapsible" :content="effectiveCollapsed ? '展开' : '收起'">
          <el-button
            class="pro-card__collapse"
            text
            circle
            :icon="ArrowDown"
            :aria-label="effectiveCollapsed ? '展开' : '收起'"
            @click="toggleCollapse"
          />
        </el-tooltip>
      </div>
    </header>

    <div v-show="!effectiveCollapsed" class="pro-card__body" :style="resolvedBodyStyle">
      <slot v-if="loading" name="loading" :meta="meta">
        <el-skeleton animated :rows="3" />
      </slot>
      <div v-else class="pro-card__content" :style="contentStyle">
        <slot :meta="meta" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts" generic="TMeta extends object = Record<string, never>">
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElButton, ElSkeleton, ElTooltip } from 'element-plus'
import { useProConfigProvider } from '../pro-config-provider'
import { normalizeProCardSpacing, resolveProCardColumns } from './pro-card-utils'
import { useProCardState } from './use-pro-card-state'
import type { ProCardExpose, ProCardProps } from './pro-card'

defineOptions({ name: 'ProCard' })

const props = withDefaults(defineProps<ProCardProps<TMeta>>(), {
  meta: () => ({}) as TMeta,
  loading: false,
  collapsed: undefined,
  defaultCollapsed: false,
  headerBordered: false,
  split: false,
  direction: 'vertical',
  columns: 1,
  gap: 16,
  bodyPadding: true,
  bodyStyle: () => ({})
})
const emit = defineEmits<{
  'update:collapsed': [collapsed: boolean]
  collapse: [collapsed: boolean]
}>()
const slots = useSlots()
const proConfig = useProConfigProvider()
const cardRef = ref<HTMLElement>()
const width = ref(1200)
let resizeObserver: ResizeObserver | undefined

const { effectiveCollapsed, setCollapsed, toggleCollapse } = useProCardState({
  collapsed: () => props.collapsed,
  defaultCollapsed: props.defaultCollapsed,
  onChange: collapsed => {
    emit('update:collapsed', collapsed)
    emit('collapse', collapsed)
  }
})

const resolvedBordered = computed(() => props.bordered ?? proConfig.value.card?.bordered ?? true)
const resolvedShadow = computed(() => props.shadow ?? proConfig.value.card?.shadow ?? 'never')
const resolvedCollapsible = computed(
  () => props.collapsible ?? proConfig.value.card?.collapsible ?? false
)
const hasHeader = computed(() =>
  Boolean(
    props.title ||
      props.subtitle ||
      slots.title ||
      slots.subtitle ||
      slots.extra ||
      resolvedCollapsible.value
  )
)
const resolvedBodyStyle = computed(() => ({
  ...props.bodyStyle,
  padding: normalizeProCardSpacing(props.bodyPadding)
}))
const contentStyle = computed(() => ({
  '--pro-card-columns': resolveProCardColumns(props.columns, width.value),
  '--pro-card-gap': normalizeProCardSpacing(props.gap)
}))

onMounted(() => {
  if (!cardRef.value) return
  width.value = cardRef.value.clientWidth || width.value
  if (typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(entries => {
    width.value = entries[0]?.contentRect.width || width.value
  })
  resizeObserver.observe(cardRef.value)
})
onBeforeUnmount(() => resizeObserver?.disconnect())

const exposed: ProCardExpose = {
  getCollapsed: () => effectiveCollapsed.value,
  setCollapsed,
  toggleCollapse
}
defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-card {
  min-width: 0;
  overflow: hidden;
  color: var(--el-text-color-primary);
  background: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
  transition:
    border-color var(--el-transition-duration-fast),
    box-shadow var(--el-transition-duration-fast);

  &.is-bordered {
    border: 1px solid var(--el-border-color-light);
  }

  &.is-shadow-always,
  &.is-shadow-hover:hover {
    box-shadow: var(--el-box-shadow-light);
  }

  &__header {
    display: flex;
    min-height: 52px;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 20px;
  }

  &.is-header-bordered &__header {
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  &__heading {
    min-width: 0;
  }

  &__title {
    overflow: hidden;
    font-size: var(--el-font-size-medium);
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__subtitle {
    margin-top: 3px;
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }

  &__extra {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
  }

  &__collapse {
    transition: transform var(--el-transition-duration-fast);
  }

  &.is-collapsed &__collapse {
    transform: rotate(-90deg);
  }

  &__body,
  &__content {
    min-width: 0;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(var(--pro-card-columns), minmax(0, 1fr));
    gap: var(--pro-card-gap);
  }

  &.is-horizontal &__content {
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    grid-template-columns: none;
  }

  &.is-split &__content {
    gap: 0;
  }

  &.is-split :deep(.pro-card__content > *) {
    padding: var(--pro-card-gap);
    border-right: 1px solid var(--el-border-color-lighter);
  }

  &.is-split :deep(.pro-card__content > *:last-child) {
    border-right: 0;
  }
}
</style>
