<template>
  <div
    class="pro-code-editor"
    :class="[
      `is-${resolvedTheme}`,
      { 'is-disabled': disabled, 'is-readonly': readonly, 'is-focused': focused }
    ]"
    :style="editorStyle"
  >
    <div class="pro-code-editor__meta">
      <span>{{ language || 'text' }}</span>
      <span>{{ lineCount }} 行</span>
    </div>
    <div class="pro-code-editor__body">
      <div v-if="lineNumbers" ref="gutterRef" class="pro-code-editor__gutter" aria-hidden="true">
        <span v-for="line in lines" :key="line">{{ line }}</span>
      </div>
      <textarea
        ref="textareaRef"
        class="pro-code-editor__textarea"
        :class="{ 'is-wrap': wordWrap }"
        :value="modelValue"
        :readonly="readonly"
        :disabled="disabled"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :spellcheck="false"
        :wrap="wordWrap ? 'soft' : 'off'"
        @input="handleInput"
        @keydown="handleKeydown"
        @scroll="syncScroll"
        @focus="focused = true"
        @blur="focused = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { ProCodeEditorExpose, ProCodeEditorProps } from './pro-code-editor'
import {
  getCodeEditorLines,
  indentCodeEditorSelection,
  insertCodeEditorText
} from './pro-code-editor-utils'

defineOptions({ name: 'ProCodeEditor' })

const props = withDefaults(defineProps<ProCodeEditorProps>(), {
  modelValue: '',
  language: 'text',
  theme: 'auto',
  readonly: false,
  disabled: false,
  lineNumbers: true,
  wordWrap: false,
  tabSize: 2,
  height: 320,
  autofocus: false
})
const emit = defineEmits<{
  'update:model-value': [value: string]
  change: [value: string]
  focus: []
  blur: []
}>()

const textareaRef = ref<HTMLTextAreaElement>()
const gutterRef = ref<HTMLDivElement>()
const focused = ref(false)
const lines = computed(() => getCodeEditorLines(props.modelValue))
const lineCount = computed(() => lines.value.length)
const resolvedTheme = computed(() => props.theme)
const editorStyle = computed(() => ({
  ...props.bodyStyle,
  height: toCssSize(props.height),
  minHeight: toCssSize(props.minHeight),
  maxHeight: toCssSize(props.maxHeight),
  '--pro-code-editor-tab-size': props.tabSize
}))

onMounted(() => {
  if (props.autofocus) textareaRef.value?.focus()
})

function updateValue(value: string) {
  emit('update:model-value', value)
  emit('change', value)
}

function handleInput(event: Event) {
  updateValue((event.target as HTMLTextAreaElement).value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Tab' || props.readonly || props.disabled) return
  event.preventDefault()
  const textarea = textareaRef.value
  if (!textarea) return

  if (textarea.selectionStart === textarea.selectionEnd && !event.shiftKey) {
    const result = insertCodeEditorText(
      props.modelValue,
      ' '.repeat(props.tabSize),
      textarea.selectionStart,
      textarea.selectionEnd
    )
    updateValue(result.value)
    void restoreSelection(result.cursor, result.cursor)
    return
  }

  const result = indentCodeEditorSelection(
    props.modelValue,
    textarea.selectionStart,
    textarea.selectionEnd,
    props.tabSize,
    event.shiftKey
  )
  updateValue(result.value)
  void restoreSelection(result.selectionStart, result.selectionEnd)
}

function syncScroll() {
  if (gutterRef.value && textareaRef.value) {
    gutterRef.value.scrollTop = textareaRef.value.scrollTop
  }
}

async function restoreSelection(start: number, end: number) {
  await nextTick()
  textareaRef.value?.setSelectionRange(start, end)
}

function insertText(value: string) {
  const textarea = textareaRef.value
  const start = textarea?.selectionStart ?? props.modelValue.length
  const end = textarea?.selectionEnd ?? start
  const result = insertCodeEditorText(props.modelValue, value, start, end)
  updateValue(result.value)
  void restoreSelection(result.cursor, result.cursor)
}

const exposed: ProCodeEditorExpose = {
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  getValue: () => props.modelValue,
  setValue: updateValue,
  insertText,
  selectAll: () => textareaRef.value?.select(),
  getTextarea: () => textareaRef.value
}
defineExpose(exposed)

function toCssSize(value: string | number | undefined) {
  return typeof value === 'number' ? `${value}px` : value
}
</script>

<style scoped lang="scss">
.pro-code-editor {
  --pro-code-editor-bg: var(--el-bg-color-overlay, #fff);
  --pro-code-editor-gutter: var(--el-fill-color-light, #f5f7fa);
  --pro-code-editor-text: var(--el-text-color-primary, #303133);
  --pro-code-editor-muted: var(--el-text-color-secondary, #909399);
  --pro-code-editor-border: var(--el-border-color, #dcdfe6);
  display: flex;
  min-width: 0;
  overflow: hidden;
  flex-direction: column;
  border: 1px solid var(--pro-code-editor-border);
  border-radius: var(--el-border-radius-base, 4px);
  background: var(--pro-code-editor-bg);
  color: var(--pro-code-editor-text);
  transition: border-color var(--el-transition-duration-fast, 0.2s);

  &.is-focused {
    border-color: var(--el-color-primary, #409eff);
  }

  &.is-dark,
  &.is-auto:global(.dark *) {
    --pro-code-editor-bg: #1e1e1e;
    --pro-code-editor-gutter: #252526;
    --pro-code-editor-text: #d4d4d4;
    --pro-code-editor-muted: #858585;
    --pro-code-editor-border: #3c3c3c;
  }

  &__meta {
    display: flex;
    min-height: 34px;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    border-bottom: 1px solid var(--pro-code-editor-border);
    background: var(--pro-code-editor-gutter);
    color: var(--pro-code-editor-muted);
    font-size: 12px;
  }

  &__body {
    display: flex;
    min-height: 0;
    flex: 1;
  }

  &__gutter {
    display: flex;
    width: 48px;
    overflow: hidden;
    flex: 0 0 48px;
    flex-direction: column;
    padding: 12px 8px;
    background: var(--pro-code-editor-gutter);
    color: var(--pro-code-editor-muted);
    font:
      13px/1.6 ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;
    text-align: right;
    user-select: none;
  }

  &__textarea {
    width: 100%;
    min-width: 0;
    min-height: 100%;
    resize: none;
    border: 0;
    outline: 0;
    padding: 12px 14px;
    background: transparent;
    color: inherit;
    font:
      13px/1.6 ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      monospace;
    tab-size: var(--pro-code-editor-tab-size);
    white-space: pre;

    &.is-wrap {
      white-space: pre-wrap;
    }

    &::placeholder {
      color: var(--pro-code-editor-muted);
    }
  }

  &.is-disabled {
    opacity: 0.65;
  }
}
</style>
