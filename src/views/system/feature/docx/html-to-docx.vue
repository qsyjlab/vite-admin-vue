<template>
  <page-wrapper class="html-to-docx-page">
    <!-- 渐变标题区 -->
    <header class="html-to-docx-page__header">
      <div class="html-to-docx-page__title">
        <div class="html-to-docx-page__title-icon">
          <EditPen />
        </div>
        <div>
          <h1>富文本导出 DOCX</h1>
          <p>使用富文本编辑器编写内容，一键导出为 Word 文档，保留样式与排版。</p>
        </div>
      </div>
      <div class="html-to-docx-page__capabilities">
        <el-tag effect="plain" type="primary">富文本编辑</el-tag>
        <el-tag effect="plain" type="success">一键导出</el-tag>
        <el-tag effect="plain" type="warning">Word 兼容</el-tag>
      </div>
    </header>

    <!-- 工具栏 -->
    <section class="html-to-docx-page__toolbar">
      <div class="html-to-docx-page__toolbar-left">
        <el-icon class="html-to-docx-page__toolbar-icon"><Document /></el-icon>
        <span class="html-to-docx-page__toolbar-text">编辑内容后可导出为 .docx 文件</span>
      </div>
      <div class="html-to-docx-page__toolbar-right">
        <el-button :icon="Document" @click="previewVisible = !previewVisible">
          {{ previewVisible ? '隐藏预览' : '查看预览' }}
        </el-button>
        <el-button type="primary" :icon="Download" @click="exportHtmlToWord">导出 Word</el-button>
      </div>
    </section>

    <!-- 编辑器区 -->
    <section class="html-to-docx-page__editor">
      <pro-tinymce v-model="content" :height="400"></pro-tinymce>
    </section>

    <!-- 预览区 -->
    <section v-if="previewVisible" class="html-to-docx-page__preview">
      <h3 class="html-to-docx-page__preview-title">内容预览</h3>
      <div class="html-to-docx-page__preview-content" v-html="content"></div>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { EditPen, Download, Document } from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import { ProTinymce } from '@/components/tinymce'
import { pureRichTextExportDocx } from '@/utils'

defineOptions({ name: 'HtmlToDocxPage' })

const route = useRoute()

// 编辑器默认内容示例
const content = ref(
  '<h2>富文本导出 DOCX 示例</h2>' +
    '<p>这是一个<strong>富文本编辑器</strong>示例，支持<em>加粗</em>、<u>下划线</u>等基础样式。</p>' +
    '<ul><li>支持列表渲染</li><li>支持标题、段落样式</li><li>导出后保留格式</li></ul>'
)

// 预览切换
const previewVisible = ref(false)

// 导出为 Word 文档
const exportHtmlToWord = () => {
  if (!content.value) {
    ElMessage.warning('内容为空，无法导出')
    return
  }
  pureRichTextExportDocx(content.value, route.meta.title)
  ElMessage.success('Word 文档导出成功')
}
</script>

<style scoped lang="scss">
.html-to-docx-page {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  // 渐变标题区
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 24px;
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-9),
      var(--el-color-warning-light-9)
    );
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;

    h1 {
      margin: 0;
      font-size: 22px;
      color: var(--el-text-color-primary);
    }

    p {
      margin: 6px 0 0;
      color: var(--el-text-color-secondary);
    }
  }

  &__title-icon {
    display: inline-flex;
    width: 48px;
    height: 48px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: var(--global-layout-radius);
    background: linear-gradient(135deg, #409eff, #e6a23c);
    color: #fff;
    box-shadow: 0 6px 16px var(--global-shadow-color);

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__capabilities {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    flex: none;
  }

  // 工具栏
  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-bg-color-overlay);
  }

  &__toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  &__toolbar-icon {
    font-size: 18px;
    color: var(--el-color-primary);
    flex: none;
  }

  &__toolbar-text {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__toolbar-right {
    display: flex;
    gap: 8px;
    flex: none;
  }

  // 编辑器区
  &__editor {
    padding: 8px;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-bg-color-overlay);
  }

  // 预览区
  &__preview {
    padding: 20px;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-bg-color-overlay);
  }

  &__preview-title {
    margin: 0 0 12px;
    font-size: 15px;
    color: var(--el-text-color-primary);
  }

  &__preview-content {
    line-height: 1.7;
    color: var(--el-text-color-regular);

    :deep(h1),
    :deep(h2),
    :deep(h3) {
      color: var(--el-text-color-primary);
      margin: 12px 0 8px;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 24px;
    }
  }
}

// 响应式：760px 以下标题区与工具栏纵向排列
@media (max-width: 760px) {
  .html-to-docx-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .html-to-docx-page__capabilities {
    justify-content: flex-start;
  }

  .html-to-docx-page__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .html-to-docx-page__toolbar-right {
    justify-content: flex-end;
  }
}
</style>
