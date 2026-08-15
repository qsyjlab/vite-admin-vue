<template>
  <div class="pro-tabs" :style="{ '--tab-height': `${height}px` }">
    <!-- 左箭头（超出时显示） -->
    <button
      v-if="showNavArrows"
      type="button"
      class="pro-tabs__nav-btn pro-tabs__nav-btn--left"
      :class="{ 'is-disabled': !canScrollLeft }"
      aria-label="向左滚动标签"
      @click.stop="scrollLeft"
    >
      <ProIcon icon="ep.arrow-left" :size="14" />
    </button>

    <!-- 标签滚动区域 -->
    <div ref="scrollRef" class="pro-tabs__scroll">
      <div
        ref="tabsListRef"
        class="pro-tabs__list"
        @mousedown.prevent.stop="handleDragStart"
        @contextmenu.prevent.stop="handleContextMenu"
      >
        <div
          v-for="(tab, index) in tabs"
          :key="tab.key"
          :ref="el => setTabRef(el as HTMLElement, index)"
          :data-key="tab.key"
          :data-index="index"
          :class="[
            'pro-tabs__item',
            {
              'is-active': modelValue === tab.key,
              'is-dragging': draggingKey === tab.key,
              'is-affix': tab.affix
            }
          ]"
          @click.stop="handleTabClick(tab)"
        >
          <!-- 图标 -->
          <span v-if="tab.icon" class="pro-tabs__item-icon">
            <ProIcon :icon="tab.icon" :size="fontSize" />
          </span>

          <!-- 文字 -->
          <span class="pro-tabs__item-label" :style="{ fontSize: `${fontSize}px` }">{{
            tab.label
          }}</span>

          <span v-if="tab.affix" class="pro-tabs__item-affix" title="固定标签">
            <ProIcon icon="ep.lock" :size="12" />
          </span>

          <!-- 关闭按钮 -->
          <button
            v-if="tab.closable !== false && !tab.affix"
            type="button"
            class="pro-tabs__item-close"
            :aria-label="`关闭 ${tab.label}`"
            @click.stop="handleClose(tab, index)"
          >
            <ProIcon icon="ep.close" :size="12" />
          </button>
        </div>
      </div>
    </div>

    <!-- 右箭头（超出时显示） -->
    <button
      v-if="showNavArrows"
      type="button"
      class="pro-tabs__nav-btn pro-tabs__nav-btn--right"
      :class="{ 'is-disabled': !canScrollRight }"
      aria-label="向右滚动标签"
      @click.stop="scrollRight"
    >
      <ProIcon icon="ep.arrow-right" :size="14" />
    </button>

    <!-- 更多操作 -->
    <div v-if="showMoreAction" class="pro-tabs__action">
      <el-dropdown trigger="click" placement="bottom-end">
        <button type="button" class="pro-tabs__more-btn" aria-label="标签页操作" title="标签页操作">
          <ProIcon icon="ep.more-filled" :size="16" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <slot name="more-menu"></slot>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Sortable from 'sortablejs'
import type { ProTabItem, ProTabsProps } from './types'
import { ProIcon } from '@/components/icon'
import './pro-tabs.scss'

const props = withDefaults(defineProps<ProTabsProps>(), {
  height: 48,
  fontSize: 13,
  draggable: true,
  showMoreAction: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', key: string | number): void
  (e: 'tab-click', tab: ProTabItem): void
  (e: 'tab-close', tab: ProTabItem, index: number): void
  (e: 'contextmenu', event: MouseEvent, tab: ProTabItem): void
  (e: 'drag-end', newOrder: string[]): void
}>()

const scrollRef = ref<HTMLElement>()
const tabsListRef = ref<HTMLElement>()
const sortableInstance = ref<Sortable>()
const draggingKey = ref<string | number | null>(null)

// ========== 滚动导航状态 ==========
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const showNavArrows = ref(false)
let resizeObserver: ResizeObserver | null = null

// 每个 tab 的 DOM 引用，用于 scrollIntoView
const tabRefs = ref<Map<number, HTMLElement>>(new Map())

function setTabRef(el: HTMLElement | null, index: number) {
  if (el) {
    tabRefs.value.set(index, el)
  } else {
    tabRefs.value.delete(index)
  }
}

// ========== 超出检测 ==========
function checkOverflow() {
  const scrollEl = scrollRef.value
  const listEl = tabsListRef.value
  if (!scrollEl || !listEl) return

  const { scrollWidth, clientWidth, scrollLeft } = scrollEl
  const isOverflow = scrollWidth > clientWidth + 1 // +1 容差

  showNavArrows.value = isOverflow
  canScrollLeft.value = isOverflow && scrollLeft > 0
  canScrollRight.value = isOverflow && scrollLeft + clientWidth < scrollWidth - 1
}

function updateScrollState() {
  const scrollEl = scrollRef.value
  if (!scrollEl) return
  canScrollLeft.value = scrollEl.scrollLeft > 0
  canScrollRight.value = scrollEl.scrollLeft + scrollEl.clientWidth < scrollEl.scrollWidth - 1
}

// ========== 滚动控制 ==========
function scrollLeft() {
  if (!scrollRef.value || !canScrollLeft.value) return
  scrollRef.value.scrollBy({ left: -200, behavior: 'smooth' })
}

function scrollRight() {
  if (!scrollRef.value || !canScrollRight.value) return
  scrollRef.value.scrollBy({ left: 200, behavior: 'smooth' })
}

function scrollToActive() {
  const activeIndex = props.tabs.findIndex(tab => tab.key === props.modelValue)
  if (activeIndex < 0) return

  const activeEl = tabRefs.value.get(activeIndex)
  if (!activeEl || !scrollRef.value) return

  activeEl.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center'
  })
}

// ========== 拖拽排序 ==========
let sortableInitialized = false

function initSortable() {
  if (!props.draggable || !tabsListRef.value || sortableInitialized) return

  sortableInstance.value = Sortable.create(tabsListRef.value, {
    animation: 200,
    delay: 100,
    delayOnTouchOnly: true,
    handle: '.pro-tabs__item',
    filter: '.is-affix',
    preventOnFilter: false,
    ghostClass: 'pro-tabs__item--ghost',
    chosenClass: 'pro-tabs__item--chosen',
    dragClass: 'pro-tabs__item--drag',
    onStart(evt) {
      const item = props.tabs[evt.oldIndex!]
      if (item) draggingKey.value = item.key
    },
    onEnd(evt) {
      draggingKey.value = null

      if (
        evt.oldIndex !== undefined &&
        evt.newIndex !== undefined &&
        evt.oldIndex !== evt.newIndex
      ) {
        const newOrder = [...props.tabs]
        const [moved] = newOrder.splice(evt.oldIndex, 1)
        if (moved) {
          newOrder.splice(evt.newIndex, 0, moved)
          emit(
            'drag-end',
            newOrder.map(t => t.key)
          )
        }
      }
    }
  })

  sortableInitialized = true
}

watch(
  () => props.draggable,
  val => {
    if (!val && sortableInstance.value) {
      sortableInstance.value.destroy()
      sortableInstance.value = undefined
      sortableInitialized = false
    } else if (val) {
      nextTick(() => initSortable())
    }
  },
  { immediate: true }
)

// 监听 tabs 数量变化和 modelValue 变化
watch(
  () => [props.tabs.length, props.modelValue],
  () => {
    nextTick(() => {
      checkOverflow()
      scrollToActive()
    })
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    checkOverflow()
    scrollToActive()
  })

  // 监听滚动区域大小变化
  if (scrollRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      checkOverflow()
    })
    resizeObserver.observe(scrollRef.value)
    if (tabsListRef.value) {
      resizeObserver.observe(tabsListRef.value)
    }
  }

  // 监听滚动事件更新箭头状态
  scrollRef.value?.addEventListener('scroll', updateScrollState, { passive: true })
})

onBeforeUnmount(() => {
  if (sortableInstance.value) {
    sortableInstance.value.destroy()
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  scrollRef.value?.removeEventListener('scroll', updateScrollState)
})

// ========== 事件处理 ==========
function handleTabClick(tab: ProTabItem) {
  emit('update:modelValue', tab.key)
  emit('tab-click', tab)
  // 点击后确保可见
  nextTick(() => scrollToActive())
}

function handleClose(tab: ProTabItem, index: number) {
  emit('tab-close', tab, index)
}

function handleContextMenu(event: MouseEvent) {
  const target = (event.target as HTMLElement).closest('.pro-tabs__item')
  if (target) {
    const key = target.getAttribute('data-key')
    const tab = props.tabs.find(t => t.key === key)
    if (tab) emit('contextmenu', event, tab)
  }
}

function handleDragStart() {
  // 由 sortablejs 处理
}
</script>
