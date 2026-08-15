<template>
  <div class="pro-json-editor" :class="{ 'has-error': currentError }">
    <div class="pro-json-editor__toolbar">
      <div class="pro-json-editor__status">
        <span class="pro-json-editor__dot" />
        <span>{{ currentError ? errorLabel : 'JSON 格式正确' }}</span>
      </div>
      <div v-if="!readonly && !disabled" class="pro-json-editor__actions">
        <button type="button" @click="format">格式化</button>
        <button type="button" @click="minify">压缩</button>
      </div>
    </div>

    <pro-code-editor
      ref="editorRef"
      v-model="textValue"
      language="json"
      :theme="theme"
      :readonly="readonly"
      :disabled="disabled"
      :line-numbers="lineNumbers"
      :word-wrap="wordWrap"
      :tab-size="indent"
      :placeholder="placeholder"
      :height="height"
      :min-height="minHeight"
      :max-height="maxHeight"
      :autofocus="autofocus"
      :body-style="bodyStyle"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ProCodeEditor, type ProCodeEditorInstance } from '../pro-code-editor'
import type {
  ProJsonEditorError,
  ProJsonEditorExpose,
  ProJsonEditorProps,
  ProJsonValue
} from './pro-json-editor'
import {
  formatJsonText,
  minifyJsonText,
  parseJsonValue,
  stringifyJsonValue
} from './pro-json-editor-utils'

defineOptions({ name: 'ProJsonEditor' })

const props = withDefaults(defineProps<ProJsonEditorProps>(), {
  modelValue: () => ({}),
  mode: 'object',
  indent: 2,
  sortKeys: false,
  validateOnChange: true,
  theme: 'auto',
  readonly: false,
  disabled: false,
  lineNumbers: true,
  wordWrap: false,
  height: 360,
  autofocus: false,
  placeholder: '请输入 JSON'
})
const emit = defineEmits<{
  'update:model-value': [value: ProJsonValue]
  change: [value: ProJsonValue, text: string]
  'validation-change': [valid: boolean, error?: ProJsonEditorError]
}>()

const editorRef = ref<ProCodeEditorInstance>()
const textValue = ref(stringifyJsonValue(props.modelValue, props.indent, props.sortKeys))
const currentError = ref<ProJsonEditorError>()
let internalUpdate = false

watch(
  () => props.modelValue,
  value => {
    if (internalUpdate) return
    textValue.value = stringifyJsonValue(value, props.indent, props.sortKeys)
    if (props.validateOnChange) validate()
  },
  { deep: true }
)

const errorLabel = computed(() => {
  if (!currentError.value) return ''
  const position = currentError.value.line
    ? `第 ${currentError.value.line} 行${currentError.value.column ? `，第 ${currentError.value.column} 列` : ''}`
    : ''
  return position ? `${position}：${currentError.value.message}` : currentError.value.message
})

function handleChange(value: string) {
  textValue.value = value
  if (!props.validateOnChange) {
    if (props.mode === 'string') emitValue(value, value)
    return
  }
  const result = parseJsonValue(value)
  setError(result.error)
  if (result.error || result.value === undefined) return
  emitValue(props.mode === 'string' ? value : result.value, value)
}

function emitValue(value: ProJsonValue, text: string) {
  internalUpdate = true
  emit('update:model-value', value)
  emit('change', value, text)
  queueMicrotask(() => (internalUpdate = false))
}

function validate() {
  const result = parseJsonValue(textValue.value)
  setError(result.error)
  return !result.error
}

function format() {
  const result = formatJsonText(textValue.value, props.indent, props.sortKeys)
  setError(result.error)
  if (result.error) return false
  textValue.value = result.text
  emitValue(props.mode === 'string' ? result.text : (result.value as ProJsonValue), result.text)
  return true
}

function minify() {
  const result = minifyJsonText(textValue.value, props.sortKeys)
  setError(result.error)
  if (result.error) return false
  textValue.value = result.text
  emitValue(props.mode === 'string' ? result.text : (result.value as ProJsonValue), result.text)
  return true
}

function setValue(value: ProJsonValue) {
  textValue.value = stringifyJsonValue(value, props.indent, props.sortKeys)
  if (validate()) emitValue(props.mode === 'string' ? textValue.value : value, textValue.value)
}

function setError(error?: ProJsonEditorError) {
  currentError.value = error
  emit('validation-change', !error, error)
}

const exposed: ProJsonEditorExpose = {
  focus: () => editorRef.value?.focus(),
  blur: () => editorRef.value?.blur(),
  getValue: () => {
    if (props.mode === 'string') return textValue.value
    return parseJsonValue(textValue.value).value
  },
  getText: () => textValue.value,
  setValue,
  validate,
  format,
  minify,
  getError: () => currentError.value
}
defineExpose(exposed)
</script>

<style scoped lang="scss">
.pro-json-editor {
  min-width: 0;

  &__toolbar {
    display: flex;
    min-height: 38px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  &__status {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 8px;
    color: var(--el-color-success, #67c23a);
    font-size: var(--el-font-size-small, 13px);
  }

  &__dot {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border-radius: 50%;
    background: currentColor;
  }

  &__actions {
    display: flex;
    gap: 8px;

    button {
      padding: 5px 10px;
      border: 1px solid var(--el-border-color, #dcdfe6);
      border-radius: var(--el-border-radius-base, 4px);
      background: var(--el-bg-color-overlay, #fff);
      color: var(--el-text-color-regular, #606266);
      cursor: pointer;
      font: inherit;
    }
  }

  &.has-error &__status {
    color: var(--el-color-danger, #f56c6c);
  }
}
</style>
