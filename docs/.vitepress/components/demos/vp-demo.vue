<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useClipboard, useToggle } from '@vueuse/core'
import { CaretTop, DocumentCopy, Link } from '@element-plus/icons-vue'

import Example from './vp-example.vue'
import SourceCode from './vp-source-code.vue'

const props = withDefaults(
  defineProps<{
    // demos?: object
    source?: string
    path?: string
    rawSource?: string
    description?: string
  }>(),
  {
    // demos: ()=> ({}),
    description: ''
  }
)

const demos = import.meta.glob('../../../examples/**/*.vue', { eager: true })

// const vm = getCurrentInstance()!

const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.rawSource || ''),
  read: false
})

const [sourceVisible, toggleSourceVisible] = useToggle()
// const lang = useLang()
// const demoSourceUrl = useSourceCode(toRef(props, 'path'))

const sourceCodeRef = ref<HTMLButtonElement>()
const formatPathDemos = computed(() => {
  let _demos = {}

  Object.keys(demos).forEach(key => {
    _demos[key.replace('../../../examples/', '').replace('.vue', '')] = demos[key].default
  })

  return _demos
})

// const locale = computed(() => demoBlockLocale[lang.value])
const decodedDescription = computed(() => decodeURIComponent(props.description!))

const onPlaygroundClick = () => {
  // const { link } = usePlayground(props.rawSource)
  // if (!isClient) return
  // window.open(link)
}

const onSourceVisibleKeydown = (e: KeyboardEvent) => {
  if (['Enter', 'Space'].includes(e.code)) {
    e.preventDefault()
    toggleSourceVisible(false)
    sourceCodeRef.value?.focus()
  }
}

const copyCode = async () => {
  // const { $message } = vm.appContext.config.globalProperties
  if (!isSupported) {
    // $message.error(locale.value['copy-error'])
  }
  try {
    await copy()
    // $message.success(locale.value['copy-success'])
  } catch (e: any) {
    // $message.error(e.message)
  }
}
</script>

<template>
  <ClientOnly>
    <!-- danger here DO NOT USE INLINE SCRIPT TAG -->
    <p text="sm" v-html="decodedDescription" />

    <div class="example">
      <Example v-if="path" :file="path" :demo="formatPathDemos[path]" />

      <ElDivider class="m-0" />

      <div class="op-btns">
        <ElTooltip
          :content="'复制'"
          :show-arrow="false"
          :trigger="['hover', 'focus']"
          :trigger-keys="[]"
        >
          <ElIcon
            :size="16"
            :aria-label="'复制'"
            class="op-btn"
            tabindex="0"
            role="button"
            @click="copyCode"
            @keydown.prevent.enter="copyCode"
            @keydown.prevent.space="copyCode"
          >
            <DocumentCopy />
          </ElIcon>
        </ElTooltip>
        <ElTooltip content="查看代码" :show-arrow="false" :trigger="['hover', 'focus']">
          <button
            ref="sourceCodeRef"
            :aria-label="sourceVisible ? '隐藏' : '查看'"
            class="reset-btn el-icon op-btn"
            @click="toggleSourceVisible()"
          >
            <ElIcon :size="16">
              <el-icon><Link /></el-icon>
            </ElIcon>
          </button>
        </ElTooltip>

        <!-- <ElTooltip
          :content="locale['edit-in-editor']"
          :show-arrow="false"
          :trigger="['hover', 'focus']"
          :trigger-keys="[]"
        >
          <ElIcon
            :size="16"
            :aria-label="locale['edit-in-editor']"
            tabindex="0"
            role="link"
            class="op-btn"
            @click="onPlaygroundClick"
            @keydown.prevent.enter="onPlaygroundClick"
            @keydown.prevent.space="onPlaygroundClick"
          >
            <i-ri-flask-line />
          </ElIcon>
        </ElTooltip>
        <ElTooltip
          :content="locale['edit-on-github']"
          :show-arrow="false"
          :trigger="['hover', 'focus']"
          :trigger-keys="[]"
        >
          <ElIcon
            :size="16"
            class="op-btn github"
            style="color: var(--text-color-light)"
          >
            <a
              :href="demoSourceUrl"
              :aria-label="locale['edit-on-github']"
              rel="noreferrer noopener"
              target="_blank"
            >
              <i-ri-github-line />
            </a>
          </ElIcon>
        </ElTooltip>

        -->
      </div>

      <ElCollapseTransition>
        <SourceCode v-if="source" v-show="sourceVisible" :source="source" />
      </ElCollapseTransition>

      <Transition name="el-fade-in-linear">
        <div
          v-show="sourceVisible"
          class="example-float-control"
          tabindex="0"
          role="button"
          @click="toggleSourceVisible(false)"
          @keydown="onSourceVisibleKeydown"
        >
          <ElIcon :size="16">
            <CaretTop />
          </ElIcon>
          <!-- <span>{{ locale['hide-source'] }}</span> -->
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss">
.example {
  border: 1px solid var(--border-color);
  border-radius: var(--el-border-radius-base);

  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;

    .el-icon {
      &:hover {
        color: var(--text-color);
      }
    }

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: var(--text-color-lighter);
      transition: 0.2s;

      &.github a {
        transition: 0.2s;
        color: var(--text-color-lighter);

        &:hover {
          color: var(--text-color);
        }
      }
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border-color);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--bg-color, #fff);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
