<template>
  <div>
    <textarea id="demo-tinymce" ref="tinymceRef" :style="{ visibility: 'hidden' }" />
  </div>
</template>

<script lang="ts">
export default { name: 'ProTinymce' }
</script>

<script setup lang="ts">
import type { Editor, RawEditorSettings } from 'tinymce'

import { computed, nextTick, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'

import tinymce from 'tinymce/tinymce'
import './source'

import { tinymceProps } from './props'

import { THEME_MODE } from './editor'

const props = defineProps(tinymceProps)
const emits = defineEmits<{
  (event: 'change', val: string): void
  (event: 'update:modelValue', val: string): void
}>()

const tinymceRef = ref<HTMLElement | null>(null)
const tinymceEditorInstance = ref<Editor | null>(null)

onMounted(() => {
  nextTick(() => {
    initEditorInstance()
  })
})

onBeforeUnmount(() => {
  destory()
})

// 主题
const themeMode = computed(() => {
  return props.theme === THEME_MODE.light ? 'oxide' : 'oxide-dark'
})

// 语言
const lang = computed(() => {
  return props.lang
})

// 初始化选项
const initOptions = computed<RawEditorSettings>(() => {
  const { height, toolbar } = props
  const publicPath = '/'

  const resource = `${publicPath}resource/tinymce`

  return {
    height,
    toolbar,
    selector: '#demo-tinymce',
    setup: editor => {
      setupTinymceEditor(editor)
    },
    file_picker_types: 'file image media',
    skin_url: `${resource}/skins/ui/${themeMode.value}`,
    branding: false,
    default_link_target: '_blank',
    link_title: false,
    object_resizing: false,
    auto_focus: true,
    content_css: `${resource}/skins/content/default/content.css`,
    language_url: `${resource}/langs/${lang.value}.js`,
    language: lang.value,
    menubar: 'file edit insert view format table formats',
    // 黑暗模式
    plugins: 'lists image media table wordcount save preview',
    formats: {
      h1: { block: 'h1' },
      h2: { block: 'h2' },
      h3: { block: 'h3' }
    }
  }
})

// 编辑器启动
function setupTinymceEditor(editor: Editor) {
  tinymceEditorInstance.value = editor

  editor.on('init', () => {
    if (!tinymceEditorInstance.value) return

    props.modelValue && setValue(props.modelValue)
    bindHandlers(editor)
  })

  editor.on(
    props.modelValueEvents.length ? props.modelValueEvents.join(' ') : 'change keyup undo redo',
    () => {
      const content = getContent()
      emits('update:modelValue', content)
      emits('change', content)
    }
  )
}

// 绑定监听事件
function bindHandlers(editor: Editor) {
  watch(
    () => props.modelValue,
    (newVal, oldVal) => {
      if (oldVal !== newVal && newVal !== getContent()) {
        setValue(newVal || '')
      }
    }
  )
}

// 初始化实例
function initEditorInstance() {
  tinymce.init(initOptions.value)
}

// 销毁
function destory() {
  tinymce?.remove?.(unref(initOptions)?.selector as string)
}

// 设置内容
function setValue(val: string) {
  tinymceEditorInstance.value && tinymceEditorInstance.value.setContent(val)
}

// 获取内容
function getContent() {
  return tinymceEditorInstance.value?.getContent({ format: props.outputFormat }) || ''
}
</script>
