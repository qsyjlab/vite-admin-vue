<template>
  <div class="anchor" ref="anchorRef">
    <span class="anchor-indicator" ref="indicatorRef"></span>

    <div
      :class="['anchor__link', item.link === state.active ? 'active' : '']"
      v-for="(item, index) in anchors"
      :key="index"
      @click="() => triggerAnchor(item.link)"
    >
      {{ item.title }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { getScroll, scrollTo } from '@/utils'
import { ref, getCurrentInstance, reactive, nextTick, watch, onMounted } from 'vue'
// import type { Router } from 'vue-router'
/**
 * TODO:
 *
 * 1.路由模式
 * 2.子集嵌套锚点
 * 3.自定义样式内容 （插槽等）
 */

type AnchorContainer = HTMLElement | Window

interface AnchorItem {
  title: string
  link: string
}

const props = withDefaults(
  defineProps<{
    container?: string | (() => HTMLElement | Window)
    anchors: AnchorItem[]
  }>(),
  {
    container: () => window,
    anchors: () => []
  }
)

const instance = getCurrentInstance()
// TODO: 路由模式
// const router = instance?.appContext.config.globalProperties.$router as Router
// const route = instance?.appContext.config.globalProperties.$route

const anchorRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLSpanElement | null>(null)

const state = reactive<{
  active: string
  animating: boolean
}>({
  active: '',
  animating: false
})

onMounted(() => {
  const scrollContainer = getCurrentContainer()
  scrollContainer?.addEventListener('scroll', () => {
    if (state.animating) return

    const currentActiveLink = getInternalCurrentAnchor(props.anchors.map(i => i.link))
    if (currentActiveLink) {
      toggleActiveTab(currentActiveLink)
    }
  })
})

const triggerAnchor = (link: string) => {
  toggleActiveTab(link)
  handleScrollTo(link)
}

function toggleActiveTab(link: string) {
  state.active = link

  nextTick(() => {
    const curActiveNode = anchorRef.value?.querySelector<HTMLDivElement>('.anchor__link.active')

    if (!curActiveNode) return

    if (!indicatorRef.value) return

    const offsetTop = curActiveNode?.offsetTop
    const clientHeight = curActiveNode.clientHeight

    indicatorRef.value.style.top = `${offsetTop + clientHeight / 2}px`
    indicatorRef.value.style.height = `${clientHeight}px`
  })
}

function handleScrollTo(link: string) {
  const targetElement = document.getElementById(link)
  if (!targetElement) {
    return
  }

  const container = getCurrentContainer()
  if (!container) return
  const scrollTop = getScroll(container, true)
  const eleOffsetTop = getOffsetTop(targetElement, container)
  let y = scrollTop + eleOffsetTop
  y -= 0

  state.animating = true
  scrollTo(y, {
    // TODO: 优化掉类型
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getContainer: getCurrentContainer,

    callback() {
      state.animating = false
    }
  })
}

const getInternalCurrentAnchor = (_links: string[], _offsetTop = 0, _bounds = 5): string => {
  const linkSections: any[] = []
  const container = getCurrentContainer()
  _links.forEach(link => {
    // const sharpLinkMatch = sharpMatcherRegex.exec(link?.toString())
    // if (!sharpLinkMatch) {
    //   return
    // }

    const target = document.getElementById(link)
    if (target && container) {
      const top = getOffsetTop(target, container)

      if (top < _offsetTop + _bounds) {
        linkSections.push({ link, top })
      }
    }
  })

  if (linkSections.length) {
    const maxSection = linkSections.reduce((prev, curr) => (curr.top > prev.top ? curr : prev))
    return maxSection.link
  }
  return ''
}

function getOffsetTop(element: HTMLElement, container: AnchorContainer): number {
  if (!element.getClientRects().length) {
    return 0
  }

  const rect = element.getBoundingClientRect()

  if (rect.width || rect.height) {
    if (container === window) {
      container = document.documentElement
      return rect.top - container.clientTop
    }
    return rect.top - (container as HTMLElement).getBoundingClientRect().top
  }

  return rect.top
}

function getCurrentContainer() {
  if (typeof props.container === 'string') {
    return document.querySelector<HTMLElement>(props.container)
  }
  return props.container()
}
</script>

<style lang="scss" scoped>
.anchor {
  position: relative;

  &:before {
    position: absolute;
    inset-inline-start: 0;
    top: 0;
    height: 100%;
    border-inline-start: 2px sollink rgba(5, 5, 5, 0.06);
    content: ' ';
  }

  &-indicator {
    position: absolute;
    display: inline-block;
    width: 2px;
    transform: translateY(-50%);
    transition: top 0.1s ease-in-out;
    top: 0;
    left: 0;
    // height: 28px;
    background-color: #1677ff;
  }
  &__link {
    padding: 3px 5px;
    cursor: pointer;
    &.active {
      color: #1677ff;
    }
  }
}
</style>
