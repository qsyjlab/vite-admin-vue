<template>
  <page-wrapper class="pro-code-editor-page">
    <div class="component-page-header">
      <div>
        <h1>ProCodeEditor / ProJsonEditor</h1>
        <p>独立编辑器包，覆盖代码展示、JSON 配置、校验和格式化。</p>
      </div>
      <el-switch v-model="readonly" active-text="只读" inactive-text="可编辑" />
    </div>

    <div class="editor-grid">
      <section class="editor-panel">
        <h2>代码编辑器</h2>
        <pro-code-editor
          v-model="vueCode"
          language="vue"
          :readonly="readonly"
          :height="420"
          word-wrap
        />
      </section>

      <section class="editor-panel">
        <h2>JSON 配置编辑器</h2>
        <pro-json-editor
          v-model="jsonConfig"
          :readonly="readonly"
          :height="420"
          sort-keys
          @validation-change="valid => (jsonValid = valid)"
        />
        <p class="editor-status" :class="{ 'is-error': !jsonValid }">
          {{ jsonValid ? '配置可以安全提交' : '请修正 JSON 格式错误' }}
        </p>
      </section>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PageWrapper } from '@/components'
import { ProCodeEditor, ProJsonEditor } from '@vite-admin/pro-code-editor'

defineOptions({ name: 'ProCodeEditorPage' })

const readonly = ref(false)
const jsonValid = ref(true)
const vueCode = ref(
  `<template>\n  <pro-empty status="search" action-text="清空筛选" />\n</template>`
)
const jsonConfig = ref({
  component: 'ProTable',
  pagination: { current: 1, pageSize: 20 },
  options: { reload: true, density: true, setting: true }
})
</script>

<style scoped lang="scss">
.component-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;

  h1 {
    margin: 0;
    font-size: 24px;
  }

  p {
    margin: 6px 0 0;
    color: var(--el-text-color-secondary);
  }
}

.editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.editor-panel {
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color-overlay);

  h2 {
    margin: 0 0 14px;
    font-size: 16px;
  }
}

.editor-status {
  margin: 12px 0 0;
  color: var(--el-color-success);

  &.is-error {
    color: var(--el-color-danger);
  }
}

@media (max-width: 980px) {
  .editor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
