<template>
  <div class="anchor" ref="anchorRef">
    <span class="anchor-indicator" ref="indicatorRef"></span>

    <AnchorLink
      v-for="item in anchors"
      :key="item.link"
      :anchor="item"
      :active-key="state.active"
      @click.stop="(e, anc) => triggerAnchor(anc.link)"
    />
  </div>
</template>
<script setup lang="ts">
import { getScroll, scrollTo } from '@/utils'
import { ref, getCurrentInstance, reactive, nextTick, watch, onMounted } from 'vue'
import AnchorLink from './anchor-link.vue'
import type { AnchorContainer, AnchorItem } from './anchor'
import { onUnmounted } from 'vue'
import './anchor.scss'
// import type { Router } from 'vue-router'
/**
 * TODO:
 *
 * 1.路由模式
 * 2.子集嵌套锚点
 * 3.自定义样式内容 （插槽等）
 */

interface IProps {
  container?: string | (() => AnchorContainer)
  anchors: AnchorItem[]
  targetOffset?: number
  offsetTop?: number
  direction?: 'vertical' | 'horizontal'
  bounds?: number
}

const props = withDefaults(defineProps<IProps>(), {
  container: () => window,
  anchors: () => [],
  direction: 'vertical',
  bounds: 5
})

const instance = getCurrentInstance()
// TODO: 路由模式
// const router = instance?.appContext.config.globalProperties.$router as Router
// const route = instance?.appContext.config.globalProperties.$route

const anchorRef = ref<HTMLElement | null>(null)
const indicatorRef = ref<HTMLSpanElement | null>(null)

const state = reactive<{
  active: string
  animating: boolean
  links: string[]
}>({
  active: '',
  animating: false,
  links: []
})

watch(
  [() => props],
  () => {
    loopSetLinks(props.anchors)
    const scrollContainer = getCurrentContainer()
    handleScroll()
    scrollContainer?.addEventListener('scroll', handleScroll)
  },
  {
    flush: 'post'
  }
)

onMounted(() => {
  loopSetLinks(props.anchors)
  const scrollContainer = getCurrentContainer()
  handleScroll()
  scrollContainer?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  const scrollContainer = getCurrentContainer()
  scrollContainer?.removeEventListener('scroll', handleScroll)
})

const triggerAnchor = (link: string) => {
  toggleActiveTab(link)
  handleScrollTo(link)
}

function toggleActiveTab(link: string) {
  if (state.animating) return
  state.active = link

  nextTick(() => {
    const curActiveNode = anchorRef.value?.querySelector<HTMLDivElement>('.anchor__title.active')

    if (!curActiveNode) return

    if (!indicatorRef.value) return

    const offsetTop = curActiveNode?.offsetTop
    const clientHeight = curActiveNode.clientHeight

    indicatorRef.value.style.top = `${offsetTop + clientHeight / 2}px`
    indicatorRef.value.style.height = `${clientHeight}px`
  })
}

function handleScrollTo(link: string) {
  if (state.animating) return
  const targetElement = document.getElementById(link)
  if (!targetElement) {
    return
  }

  const container = getCurrentContainer()
  if (!container) return
  const scrollTop = getScroll(container, true)
  const eleOffsetTop = getOffsetTop(targetElement, container)
  let y = scrollTop + eleOffsetTop
  y -= getOffset()

  state.animating = true
  scrollTo(y, {
    getContainer: getCurrentContainer,

    callback() {
      requestAnimationFrame(() => {
        state.animating = false
      })
    }
  })
}

function handleScroll() {
  if (state.animating) return

  const currentActiveLink = getInternalCurrentAnchor(state.links, getOffset(), props.bounds)
  if (currentActiveLink) {
    toggleActiveTab(currentActiveLink)
  }
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
  let container = null
  if (typeof props.container === 'string') {
    container = document.querySelector<HTMLElement>(props.container)
  } else {
    container = props.container()
  }
  if (!container) return window

  return container
}

function loopSetLinks(anchors: AnchorItem[]) {
  anchors.forEach(anchor => {
    state.links.push(anchor.link)
    if (anchor.children) {
      loopSetLinks(anchor.children)
    }
  })
}

function getOffset() {
  const { targetOffset, offsetTop } = props
  return targetOffset !== undefined ? targetOffset : offsetTop || 0
}
</script>
