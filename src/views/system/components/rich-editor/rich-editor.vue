<template>
  <page-wrapper class="rich-editor-page">
    <header class="rich-editor-page__header">
      <div class="rich-editor-page__title">
        <div class="rich-editor-page__title-icon">
          <EditPen />
        </div>
        <div>
          <h1>TinyMCE 富文本编辑器</h1>
          <p>封装 TinyMCE 6，支持主题切换、只读模式、自定义工具栏、内容统计与源码预览。</p>
        </div>
      </div>
      <div class="rich-editor-page__capabilities">
        <el-tag effect="plain" type="primary">双向绑定</el-tag>
        <el-tag effect="plain" type="success">暗黑主题</el-tag>
        <el-tag effect="plain" type="warning">只读模式</el-tag>
        <el-tag effect="plain" type="info">自定义工具栏</el-tag>
      </div>
    </header>

    <div class="rich-editor-page__statistics">
      <div class="stat-card stat-card--primary">
        <div class="stat-card__icon">
          <Document />
        </div>
        <div class="stat-card__body">
          <span class="stat-card__value">{{ charCount }}</span>
          <small class="stat-card__label">字符数</small>
        </div>
      </div>
      <div class="stat-card stat-card--success">
        <div class="stat-card__icon">
          <Tickets />
        </div>
        <div class="stat-card__body">
          <span class="stat-card__value">{{ wordCount }}</span>
          <small class="stat-card__label">词数估算</small>
        </div>
      </div>
      <div class="stat-card stat-card--warning">
        <div class="stat-card__icon">
          <Timer />
        </div>
        <div class="stat-card__body">
          <span class="stat-card__value">{{ readTime }}</span>
          <small class="stat-card__label">预估阅读(分钟)</small>
        </div>
      </div>
      <div class="stat-card stat-card--info">
        <div class="stat-card__icon">
          <Picture />
        </div>
        <div class="stat-card__body">
          <span class="stat-card__value">{{ imageCount }}</span>
          <small class="stat-card__label">图片数量</small>
        </div>
      </div>
    </div>

    <div class="rich-editor-page__main">
      <section class="editor-stage">
        <div class="editor-stage__toolbar">
          <div class="editor-stage__tabs">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              type="button"
              class="editor-stage__tab"
              :class="{ 'is-active': activeTab === tab.value }"
              @click="activeTab = tab.value"
            >
              <component :is="tab.icon" />
              <span>{{ tab.label }}</span>
            </button>
          </div>
          <div class="editor-stage__controls">
            <el-segmented v-model="theme" :options="themeOptions" size="small" />
            <el-switch
              v-model="readonly"
              inline-prompt
              active-text="只读"
              inactive-text="编辑"
              size="small"
            />
            <el-button :icon="RefreshRight" size="small" @click="() => loadTemplate()"
              >载入示例</el-button
            >
            <el-button :icon="Delete" size="small" type="danger" plain @click="clearContent">
              清空
            </el-button>
          </div>
        </div>

        <div class="editor-stage__body">
          <pro-tinymce
            v-show="activeTab === 'editor'"
            v-model="content"
            :theme="theme"
            :disabled="readonly"
            :height="480"
            :toolbar="currentToolbar"
          />
          <div v-show="activeTab === 'preview'" class="content-preview" v-html="content"></div>
          <pre v-show="activeTab === 'source'" class="content-source">{{ content }}</pre>
        </div>
      </section>

      <aside class="editor-aside">
        <div class="aside-card">
          <h3 class="aside-card__title">
            <Setting />
            <span>工具栏配置</span>
          </h3>
          <p class="aside-card__desc">选择不同的工具栏组合，观察编辑器顶部菜单的变化。</p>
          <el-radio-group v-model="toolbarPreset" class="toolbar-preset">
            <el-radio-button value="full">完整工具栏</el-radio-button>
            <el-radio-button value="simple">精简工具栏</el-radio-button>
            <el-radio-button value="minimal">极简工具栏</el-radio-button>
          </el-radio-group>
          <div class="toolbar-preview">
            <code>{{ currentToolbar.join(' ') }}</code>
          </div>
        </div>

        <div class="aside-card">
          <h3 class="aside-card__title">
            <Collection />
            <span>内容模板</span>
          </h3>
          <p class="aside-card__desc">一键载入预置内容，体验不同富文本结构的渲染效果。</p>
          <div class="template-list">
            <button
              v-for="tpl in templates"
              :key="tpl.key"
              type="button"
              class="template-item"
              @click="loadTemplate(tpl.key)"
            >
              <component :is="tpl.icon" />
              <div>
                <strong>{{ tpl.name }}</strong>
                <small>{{ tpl.desc }}</small>
              </div>
            </button>
          </div>
        </div>

        <div class="aside-card aside-card--highlight">
          <h3 class="aside-card__title">
            <InfoFilled />
            <span>使用说明</span>
          </h3>
          <ul class="usage-list">
            <li><b>v-model</b> 双向绑定 HTML 字符串</li>
            <li><b>theme</b> 支持 light / dark 切换</li>
            <li><b>disabled</b> 启用只读模式</li>
            <li><b>toolbar</b> 自定义工具栏按钮顺序</li>
            <li><b>outputFormat</b> 可输出 text / html / tree</li>
          </ul>
        </div>
      </aside>
    </div>
  </page-wrapper>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Collection,
  Delete,
  Document,
  EditPen,
  InfoFilled,
  Picture,
  RefreshRight,
  Setting,
  Tickets,
  Timer
} from '@element-plus/icons-vue'
import { PageWrapper } from '@/components'
import { ProTinymce } from '@/components/tinymce'

defineOptions({ name: 'RichEditorPage' })

type ThemeValue = 'light' | 'dark'
type ToolbarPreset = 'full' | 'simple' | 'minimal'

const theme = ref<ThemeValue>('light')
const readonly = ref(false)
const activeTab = ref<'editor' | 'preview' | 'source'>('editor')
const toolbarPreset = ref<ToolbarPreset>('full')

const themeOptions = [
  { label: '明亮', value: 'light' },
  { label: '暗黑', value: 'dark' }
]

const tabs = [
  { label: '编辑', value: 'editor' as const, icon: EditPen },
  { label: '预览', value: 'preview' as const, icon: Document },
  { label: '源码', value: 'source' as const, icon: Setting }
]

const toolbarPresets: Record<ToolbarPreset, string[]> = {
  full: [
    'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat'
  ],
  simple: [
    'bold italic underline | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | undo redo | link image | removeformat'
  ],
  minimal: ['bold italic | bullist numlist | undo redo | removeformat']
}

const currentToolbar = computed(() => toolbarPresets[toolbarPreset.value])

const defaultContent = `<h2 style="text-align: center;">欢迎使用 TinyMCE 富文本编辑器</h2>
<p style="text-align: center; color: #8c8c8c;">一个功能完整、开箱即用的内容编辑方案</p>
<p>该编辑器封装了 TinyMCE 6 内核，支持<strong>加粗</strong>、<em>斜体</em>、<u>下划线</u>、<span style="color: #ff4d4f;">文字颜色</span>、<span style="background-color: #ffd591;">背景色</span>等常用排版能力。</p>
<h3>核心特性</h3>
<ul>
  <li>双向绑定 HTML 内容，方便表单集成</li>
  <li>支持明亮 / 暗黑主题切换</li>
  <li>可自定义工具栏按钮顺序与分组</li>
  <li>支持只读模式与源码编辑</li>
</ul>
<blockquote>提示：点击右侧"内容模板"可以载入不同风格的示例内容。</blockquote>`

const content = ref(defaultContent)

const templates = [
  {
    key: 'default',
    name: '入门介绍',
    desc: '基础排版与列表',
    icon: Document
  },
  {
    key: 'article',
    name: '图文文章',
    desc: '标题段落与图片',
    icon: Picture
  },
  {
    key: 'notice',
    name: '公告通知',
    desc: '居中标题与引用',
    icon: Tickets
  }
]

const templateMap: Record<string, string> = {
  default: defaultContent,
  article: `<h2>产品迭代月报：七月新版上线</h2>
<p><img src="https://via.placeholder.com/760x200/1677ff/ffffff?text=Release+Notes" alt="迭代封面" width="100%" /></p>
<p>本月我们围绕<strong>协作效率</strong>与<strong>数据分析</strong>两条主线，发布了 18 项改进。</p>
<h3>重点更新</h3>
<ol>
  <li>表格组件支持服务端排序与列持久化</li>
  <li>表单容器新增脏数据离开保护</li>
  <li>图表组件支持响应式暗黑主题</li>
</ol>
<p>如需了解完整更新内容，请访问<a href="#" target="_blank">变更日志</a>。</p>`,
  notice: `<h1 style="text-align: center; color: #1677ff;">系统维护通知</h1>
<p style="text-align: center; color: #8c8c8c;">发布时间：2026-07-12  |  维护负责人：平台运维组</p>
<blockquote style="border-left: 4px solid #1677ff; background: #e6f4ff; padding: 12px 16px;">
  为了提供更稳定的服务，系统将于 <strong>2026-07-15 凌晨 02:00 - 04:00</strong> 进行例行维护，期间部分功能不可用。
</blockquote>
<p>请各位同学提前保存工作内容，避免数据丢失。如有疑问请联系运维组。</p>`
}

function loadTemplate(key: string = 'default') {
  content.value = templateMap[key] ?? defaultContent
  activeTab.value = 'editor'
}

function clearContent() {
  content.value = ''
}

const charCount = computed(() => content.value.replace(/<[^>]+>/g, '').length)
const wordCount = computed(() => {
  const text = content.value.replace(/<[^>]+>/g, '')
  return text.trim().length ? Math.ceil(text.length / 2) : 0
})
const imageCount = computed(() => (content.value.match(/<img/g) || []).length)
const readTime = computed(() => Math.max(1, Math.ceil(wordCount.value / 60)))
</script>

<style scoped lang="scss">
.rich-editor-page {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 24px;
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-9),
      var(--el-color-success-light-9)
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
      font-size: var(--el-font-size-base);
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
    background: var(--el-color-primary);
    color: #fff;
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.32);

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

  &__statistics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  &__main {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 16px;
    align-items: start;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: var(--el-bg-color-overlay);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px var(--global-shadow-color);
  }

  &__icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: var(--global-control-radius);
    color: #fff;

    svg {
      width: 22px;
      height: 22px;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__value {
    font-size: 26px;
    font-weight: 700;
    line-height: 1.1;
    color: var(--el-text-color-primary);
  }

  &__label {
    margin-top: 4px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  &--primary .stat-card__icon {
    background: linear-gradient(135deg, #409eff, #1677ff);
  }

  &--success .stat-card__icon {
    background: linear-gradient(135deg, #67c23a, #389e0d);
  }

  &--warning .stat-card__icon {
    background: linear-gradient(135deg, #e6a23c, #d48806);
  }

  &--info .stat-card__icon {
    background: linear-gradient(135deg, #909399, #595959);
  }
}

.editor-stage {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: var(--el-bg-color-overlay);
  overflow: hidden;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    background: var(--el-fill-color-light);
    flex-wrap: wrap;
  }

  &__tabs {
    display: flex;
    gap: 4px;
  }

  &__tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border: 1px solid transparent;
    border-radius: var(--global-control-radius);
    background: transparent;
    color: var(--el-text-color-regular);
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }

    &.is-active {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary-light-5);
    }
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__body {
    min-width: 0;
  }
}

.content-preview {
  padding: 24px 32px;
  min-height: 480px;
  line-height: 1.8;
  color: var(--el-text-color-primary);

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin: 16px 0 8px;
  }

  :deep(img) {
    max-width: 100%;
    border-radius: var(--global-control-radius);
  }

  :deep(blockquote) {
    margin: 12px 0;
    padding: 12px 16px;
    border-left: 4px solid var(--el-color-primary);
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
  }
}

.content-source {
  margin: 0;
  padding: 16px;
  min-height: 480px;
  max-height: 560px;
  overflow: auto;
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-darker, #f5f5f5);
  white-space: pre-wrap;
  word-break: break-word;
}

.editor-aside {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.aside-card {
  padding: 18px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--global-layout-radius);
  background: var(--el-bg-color-overlay);

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 8px;
    font-size: 15px;
    color: var(--el-text-color-primary);

    svg {
      width: 16px;
      height: 16px;
      color: var(--el-color-primary);
    }
  }

  &__desc {
    margin: 0 0 14px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
    line-height: 1.6;
  }

  &--highlight {
    background: linear-gradient(
      135deg,
      var(--el-color-primary-light-9),
      var(--el-fill-color-light)
    );
    border-color: var(--el-color-primary-light-5);
  }
}

.toolbar-preset {
  display: flex;
  width: 100%;
  margin-bottom: 12px;

  :deep(.el-radio-button) {
    flex: 1;

    .el-radio-button__inner {
      width: 100%;
      text-align: center;
      padding: 8px 4px;
      font-size: 12px;
    }
  }
}

.toolbar-preview {
  padding: 10px 12px;
  border-radius: var(--global-control-radius);
  background: var(--el-fill-color-darker, #f5f5f5);
  max-height: 80px;
  overflow: auto;

  code {
    font-family: 'JetBrains Mono', Consolas, monospace;
    font-size: 11px;
    color: var(--el-text-color-secondary);
    word-break: break-all;
    line-height: 1.6;
  }
}

.template-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--global-control-radius);
  background: var(--el-bg-color-overlay);
  color: var(--el-text-color-regular);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
    flex: none;
    color: var(--el-color-primary);
  }

  div {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  strong {
    font-size: 13px;
    color: var(--el-text-color-primary);
  }

  small {
    font-size: 11px;
    color: var(--el-text-color-secondary);
  }

  &:hover {
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-9);
    transform: translateX(2px);
  }
}

.usage-list {
  margin: 0;
  padding-left: 18px;
  color: var(--el-text-color-regular);
  font-size: 12px;
  line-height: 1.9;

  b {
    color: var(--el-color-primary);
    font-weight: 600;
  }
}

@media (max-width: 1100px) {
  .rich-editor-page__main {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .rich-editor-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .rich-editor-page__capabilities {
    justify-content: flex-start;
  }

  .rich-editor-page__statistics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .editor-stage__toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .editor-stage__controls {
    justify-content: space-between;
  }
}
</style>
