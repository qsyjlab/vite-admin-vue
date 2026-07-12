<template>
  <page-wrapper class="publish-page">
    <header class="publish-page__header">
      <div class="publish-page__title">
        <div class="publish-page__title-icon">
          <EditPen />
        </div>
        <div>
          <h1>内容发布工作台</h1>
          <p>组合 ProTable、ProModalForm、ProTinymce 与 ProDescriptions，覆盖内容发布完整流程。</p>
        </div>
      </div>
      <div class="publish-page__capabilities">
        <el-tag effect="plain" type="primary">富文本编辑</el-tag>
        <el-tag effect="plain" type="success">表单校验</el-tag>
        <el-tag effect="plain" type="warning">草稿/发布</el-tag>
        <el-tag effect="plain" type="info">详情回显</el-tag>
      </div>
    </header>

    <div class="publish-page__summary">
      <div class="summary-item summary-item--primary">
        <div class="summary-item__icon"><Document /></div>
        <div>
          <strong>{{ summary.total }}</strong>
          <small>文章总数</small>
        </div>
      </div>
      <div class="summary-item summary-item--warning">
        <div class="summary-item__icon"><Edit /></div>
        <div>
          <strong>{{ summary.draft }}</strong>
          <small>草稿</small>
        </div>
      </div>
      <div class="summary-item summary-item--success">
        <div class="summary-item__icon"><Promotion /></div>
        <div>
          <strong>{{ summary.published }}</strong>
          <small>已发布</small>
        </div>
      </div>
      <div class="summary-item summary-item--info">
        <div class="summary-item__icon"><View /></div>
        <div>
          <strong>{{ summary.views }}</strong>
          <small>累计阅读</small>
        </div>
      </div>
    </div>

    <pro-card :body-padding="false" class="publish-page__table-card">
      <pro-table
        ref="tableRef"
        :columns="columns"
        :request="getArticlePage"
        :pagination="{ pageSize: 8, pageSizes: [8, 16, 24] }"
        row-key="id"
        header-title="文章列表"
        @request-error="handleRequestError"
      >
        <template #toolbar>
          <el-button type="primary" :icon="Plus" @click="openCreate">新建文章</el-button>
        </template>

        <template #cover="{ row }">
          <el-image
            :src="row.cover"
            fit="cover"
            class="cover-image"
            :preview-src-list="[row.cover]"
            preview-teleported
            hide-on-click-modal
          >
            <template #placeholder>
              <div class="cover-placeholder">加载中</div>
            </template>
          </el-image>
        </template>

        <template #title="{ row }">
          <div class="title-cell">
            <span class="title-cell__text">{{ row.title }}</span>
            <span v-if="row.top" class="title-cell__top">置顶</span>
          </div>
        </template>

        <template #tags="{ row }">
          <el-tag v-for="tag in row.tags" :key="tag" size="small" effect="plain" class="tag-chip">
            {{ tag }}
          </el-tag>
        </template>

        <template #operation="{ row }">
          <el-space :size="4">
            <el-button link type="primary" @click="openDetail(row)">查看</el-button>
            <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
            <el-popconfirm
              :title="`确定删除文章《${row.title}》？`"
              width="240"
              @confirm="removeArticle(row)"
            >
              <template #reference>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </pro-table>
    </pro-card>

    <el-drawer
      v-model="editorVisible"
      :title="editorTitle"
      direction="rtl"
      size="min(960px, 96vw)"
      destroy-on-close
      class="publish-editor-drawer"
    >
      <div class="editor-drawer">
        <pro-form
          ref="formRef"
          :fields="formFields"
          :initial-values="formModel"
          :label-width="92"
          label-position="left"
          :submitter="false"
          class="editor-drawer__form"
        />

        <div class="editor-drawer__content">
          <label class="editor-drawer__content-label">
            <span>正文内容</span>
            <small>支持富文本排版、图片与链接</small>
          </label>
          <pro-tinymce v-model="bodyContent" :height="360" />
        </div>

        <div class="editor-drawer__preview">
          <details>
            <summary>预览正文效果</summary>
            <div class="preview-body" v-html="bodyContent"></div>
          </details>
        </div>
      </div>

      <template #footer>
        <div class="editor-drawer__footer">
          <el-button @click="editorVisible = false">取消</el-button>
          <el-button :loading="saving" @click="saveDraft">存为草稿</el-button>
          <el-button type="primary" :loading="saving" @click="publish">发布</el-button>
        </div>
      </template>
    </el-drawer>

    <el-drawer
      v-model="detailVisible"
      title="文章详情"
      direction="rtl"
      size="min(820px, 96vw)"
      destroy-on-close
      class="publish-detail-drawer"
    >
      <div v-if="currentDetail" class="detail-drawer">
        <pro-descriptions
          :data="currentDetail"
          :columns="detailColumns"
          :column="{ xs: 1, sm: 2 }"
          title="文章信息"
        />
        <section class="detail-drawer__body">
          <h3>正文内容</h3>
          <div class="detail-drawer__content" v-html="currentDetail.body"></div>
        </section>
      </div>
    </el-drawer>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { Document, Edit, EditPen, Plus, Promotion, View } from '@element-plus/icons-vue'
import { ElMessage, ElPopconfirm } from 'element-plus'
import { PageWrapper } from '@/components'
import { ProTinymce } from '@/components/tinymce'
import {
  ProCard,
  ProDescriptions,
  ProForm,
  ProTable,
  useProForm,
  useProTable,
  type FormMethodsType,
  type FormSchema,
  type ProDescriptionColumns,
  type ProTableColumns,
  type ProTableInstance,
  type ProTableRequestParams,
  type ProTableRequestResult
} from '@vite-admin/pro-components'

defineOptions({ name: 'ContentPublishPage' })

interface ArticleRecord {
  id: number
  title: string
  category: string
  tags: string[]
  cover: string
  summary: string
  body: string
  status: 'draft' | 'published'
  author: string
  views: number
  top: boolean
  publishedAt: string
}

const categories = [
  { label: '产品动态', value: '产品动态' },
  { label: '技术分享', value: '技术分享' },
  { label: '运营活动', value: '运营活动' },
  { label: '行业观察', value: '行业观察' },
  { label: '帮助文档', value: '帮助文档' }
]

const tagOptions = [
  { label: 'Vue', value: 'Vue' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'Element Plus', value: 'Element Plus' },
  { label: '工程化', value: '工程化' },
  { label: '组件库', value: '组件库' },
  { label: 'ECharts', value: 'ECharts' },
  { label: 'TinyMCE', value: 'TinyMCE' }
]

const authors = ['陈晨', '林涛', '周宁', '李娜']
const sampleTitles = [
  'ProTable 服务端排序与列持久化实践',
  '基于 ProForm 的动态表单方案',
  'ECharts 业务图表封装思路',
  'TinyMCE 富文本编辑器接入指南',
  '中后台布局与主题切换实现',
  'ProComponents 请求生命周期设计'
]
const sampleBodies = [
  '<h2>前言</h2><p>本文介绍如何在真实业务中落地服务端排序，并保证列状态在刷新后可恢复。</p><h3>核心思路</h3><ul><li>列配置声明 <code>serverSort</code></li><li>请求参数携带排序字段</li><li>持久化使用 session storage</li></ul>',
  '<h2>背景</h2><p>动态表单在配置驱动的中后台非常常见，ProForm 提供了 schema 与依赖联动能力。</p><blockquote>提示：字段间的显隐与校验可以通过 dependencies 表达。</blockquote>',
  '<h2>目标</h2><p>让业务同学只需关心 option，无需重复处理 resize 与主题切换。</p><h3>实现要点</h3><ol><li>统一 useEcharts hook</li><li>暗黑模式监听</li><li>响应式自适应</li></ol>'
]

const coverColors = ['1677ff', '52c41a', 'fa8c16', 'eb2f96', '722ed1', '13c2c2']

function buildCover(index: number) {
  const color = coverColors[index % coverColors.length]
  const label = encodeURIComponent(sampleTitles[index % sampleTitles.length].slice(0, 8))
  return `https://via.placeholder.com/320x180/${color}/ffffff?text=${label}`
}

const articleRecords: ArticleRecord[] = Array.from({ length: 14 }, (_, index) => {
  const status: ArticleRecord['status'] = index % 3 === 0 ? 'draft' : 'published'
  return {
    id: index + 1,
    title: sampleTitles[index % sampleTitles.length],
    category: categories[index % categories.length].value,
    tags: [
      tagOptions[index % tagOptions.length].value,
      tagOptions[(index + 1) % tagOptions.length].value
    ],
    cover: buildCover(index),
    summary: `${sampleTitles[index % sampleTitles.length]}的摘要：涵盖关键概念、落地步骤与常见踩坑。`,
    body: sampleBodies[index % sampleBodies.length],
    status,
    author: authors[index % authors.length],
    views: status === 'published' ? 320 + index * 86 : 0,
    top: index % 7 === 0,
    publishedAt:
      status === 'published' ? `2026-07-${String((index % 12) + 1).padStart(2, '0')} 10:20:00` : ''
  }
})

const summary = ref({
  total: articleRecords.length,
  draft: articleRecords.filter(r => r.status === 'draft').length,
  published: articleRecords.filter(r => r.status === 'published').length,
  views: articleRecords.reduce((acc, r) => acc + r.views, 0)
})

const tableRef = useTemplateRef<ProTableInstance<ArticleRecord>>('tableRef')
const table = useProTable<ArticleRecord>(tableRef)

const statusValueEnum = {
  draft: { text: '草稿', type: 'warning' },
  published: { text: '已发布', type: 'success' }
} as const

const columns: ProTableColumns<ArticleRecord> = [
  { key: 'cover', title: '封面', width: 130 },
  { key: 'title', dataIndex: 'title', title: '标题', minWidth: 240 },
  { key: 'category', dataIndex: 'category', title: '分类', width: 120 },
  { key: 'tags', dataIndex: 'tags', title: '标签', width: 200 },
  {
    key: 'status',
    dataIndex: 'status',
    title: '状态',
    width: 100,
    valueType: 'status',
    valueEnum: statusValueEnum
  },
  { key: 'author', dataIndex: 'author', title: '作者', width: 100 },
  {
    key: 'views',
    dataIndex: 'views',
    title: '阅读',
    width: 90,
    align: 'right',
    valueType: 'number'
  },
  {
    key: 'published-at',
    dataIndex: 'publishedAt',
    title: '发布时间',
    width: 170,
    valueType: 'datetime'
  },
  { key: 'operation', title: '操作', width: 150, fixed: 'right' }
]

async function getArticlePage(
  params: ProTableRequestParams<Record<string, never>>
): Promise<ProTableRequestResult<ArticleRecord>> {
  await new Promise(resolve => setTimeout(resolve, 200))
  const start = (params.current - 1) * params.pageSize
  return {
    data: articleRecords.slice(start, start + params.pageSize),
    total: articleRecords.length,
    success: true
  }
}

function handleRequestError() {
  ElMessage.error('文章列表加载失败')
}

const formFields: FormSchema[] = [
  {
    key: 'title',
    name: 'title',
    label: '文章标题',
    el: 'el-input',
    required: true,
    requiredMessage: '请输入文章标题',
    attrs: { placeholder: '请输入文章标题', maxlength: 60, showWordLimit: true },
    col: { span: 24 }
  },
  {
    key: 'category',
    name: 'category',
    label: '分类',
    el: 'ProSelect',
    required: true,
    requiredMessage: '请选择分类',
    attrs: { options: categories, placeholder: '请选择分类', style: { width: '100%' } },
    col: { span: 12 }
  },
  {
    key: 'author',
    name: 'author',
    label: '作者',
    el: 'el-input',
    required: true,
    requiredMessage: '请输入作者',
    attrs: { placeholder: '请输入作者' },
    col: { span: 12 }
  },
  {
    key: 'tags',
    name: 'tags',
    label: '标签',
    el: 'ProCheckboxGroup',
    attrs: { options: tagOptions },
    col: { span: 24 }
  },
  {
    key: 'summary',
    name: 'summary',
    label: '摘要',
    el: 'el-input',
    attrs: {
      type: 'textarea',
      rows: 3,
      placeholder: '一句话介绍文章内容',
      maxlength: 120,
      showWordLimit: true
    },
    col: { span: 24 }
  },
  {
    key: 'top',
    name: 'top',
    label: '置顶',
    el: 'el-switch',
    col: { span: 24 }
  }
]

const editorVisible = ref(false)
const editorTitle = ref('新建文章')
const editorMode = ref<'create' | 'edit'>('create')
const editingId = ref<number | null>(null)
const bodyContent = ref('')
const saving = ref(false)
const formRef = useTemplateRef<FormMethodsType>('formRef')
const form = useProForm(formRef)

const formModel = ref<Record<string, unknown>>({
  title: '',
  category: '',
  author: '陈晨',
  tags: [],
  summary: '',
  top: false
})

function openCreate() {
  editorMode.value = 'create'
  editingId.value = null
  editorTitle.value = '新建文章'
  formModel.value = { title: '', category: '', author: '陈晨', tags: [], summary: '', top: false }
  bodyContent.value = '<h2>开始撰写正文</h2><p>在这里输入文章内容...</p>'
  editorVisible.value = true
}

function openEdit(row: ArticleRecord) {
  editorMode.value = 'edit'
  editingId.value = row.id
  editorTitle.value = `编辑：${row.title}`
  formModel.value = {
    title: row.title,
    category: row.category,
    author: row.author,
    tags: row.tags,
    summary: row.summary,
    top: row.top
  }
  bodyContent.value = row.body
  editorVisible.value = true
}

async function validateAndCollect(): Promise<(ArticleRecord & { body: string }) | null> {
  try {
    await form.validate()
  } catch {
    ElMessage.warning('请补全表单必填项')
    return null
  }
  const values = await form.getFieldsValue()
  if (!bodyContent.value || !bodyContent.value.replace(/<[^>]+>/g, '').trim()) {
    ElMessage.warning('正文内容不能为空')
    return null
  }
  return {
    id: editingId.value ?? articleRecords.length + 1,
    title: String(values.title || ''),
    category: String(values.category || ''),
    author: String(values.author || ''),
    tags: (values.tags as string[]) || [],
    summary: String(values.summary || ''),
    top: Boolean(values.top),
    body: bodyContent.value,
    status: 'draft',
    views: 0,
    cover: '',
    publishedAt: ''
  } as ArticleRecord & { body: string }
}

async function saveDraft() {
  const payload = await validateAndCollect()
  if (!payload) return
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 320))
  saving.value = false
  ElMessage.success('草稿已保存')
  editorVisible.value = false
  await table.reload(false)
}

async function publish() {
  const payload = await validateAndCollect()
  if (!payload) return
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 320))
  saving.value = false
  payload.status = 'published'
  payload.publishedAt = '2026-07-12 11:00:00'
  payload.views = 0
  payload.cover = payload.cover || buildCover(payload.id - 1)
  ElMessage.success(editorMode.value === 'create' ? '文章已发布' : '文章已更新并发布')
  editorVisible.value = false
  await table.reload(false)
}

async function removeArticle(row: ArticleRecord) {
  ElMessage.success(`文章《${row.title}》已删除`)
  await table.reload(false)
}

const detailVisible = ref(false)
const currentDetail = ref<ArticleRecord | null>(null)

const detailColumns: ProDescriptionColumns<ArticleRecord> = [
  { key: 'title', dataIndex: 'title', label: '标题', span: 2 },
  { key: 'category', dataIndex: 'category', label: '分类' },
  { key: 'author', dataIndex: 'author', label: '作者' },
  {
    key: 'status',
    dataIndex: 'status',
    label: '状态',
    valueType: 'status',
    valueEnum: statusValueEnum
  },
  { key: 'views', dataIndex: 'views', label: '阅读量', valueType: 'number' },
  {
    key: 'published-at',
    dataIndex: 'publishedAt',
    label: '发布时间',
    valueType: 'datetime',
    span: 2
  },
  { key: 'summary', dataIndex: 'summary', label: '摘要', span: 2 }
]

function openDetail(row: ArticleRecord) {
  currentDetail.value = { ...row }
  detailVisible.value = true
}
</script>

<style scoped lang="scss">
.publish-page {
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
      var(--el-color-info-light-9)
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
    background: linear-gradient(135deg, #722ed1, #409eff);
    color: #fff;
    box-shadow: 0 6px 16px rgba(114, 46, 209, 0.32);

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

  &__summary {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  &__table-card {
    :deep(.pro-table) {
      min-height: 0;
    }
  }
}

.summary-item {
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

  strong {
    display: block;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.1;
    color: var(--el-text-color-primary);
  }

  small {
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }

  &--primary .summary-item__icon {
    background: linear-gradient(135deg, #409eff, #1677ff);
  }

  &--warning .summary-item__icon {
    background: linear-gradient(135deg, #e6a23c, #d48806);
  }

  &--success .summary-item__icon {
    background: linear-gradient(135deg, #67c23a, #389e0d);
  }

  &--info .summary-item__icon {
    background: linear-gradient(135deg, #909399, #595959);
  }
}

.cover-image {
  width: 100px;
  height: 60px;
  border-radius: var(--global-control-radius);
  border: 1px solid var(--el-border-color-lighter);
}

.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.title-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;

  &__text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__top {
    flex: none;
    padding: 1px 6px;
    border-radius: var(--global-pill-radius);
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
    font-size: 11px;
  }
}

.tag-chip {
  margin: 2px 4px 2px 0;
}

.editor-drawer {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px 2px;

  &__content-label {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 8px;

    span {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    small {
      color: var(--el-text-color-secondary);
      font-size: 12px;
    }
  }

  &__preview {
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-fill-color-light);

    details {
      padding: 10px 14px;
    }

    summary {
      cursor: pointer;
      color: var(--el-text-color-regular);
      font-size: 13px;
      user-select: none;
    }

    .preview-body {
      margin-top: 12px;
      padding: 12px;
      border-top: 1px dashed var(--el-border-color-lighter);
      line-height: 1.8;
      color: var(--el-text-color-regular);

      :deep(img) {
        max-width: 100%;
      }
    }
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}

.detail-drawer {
  display: flex;
  flex-direction: column;
  gap: 18px;

  &__body {
    border-top: 1px solid var(--el-border-color-lighter);
    padding-top: 16px;

    h3 {
      margin: 0 0 12px;
      font-size: 15px;
      color: var(--el-text-color-primary);
    }
  }

  &__content {
    padding: 18px 20px;
    border: 1px solid var(--el-border-color-light);
    border-radius: var(--global-layout-radius);
    background: var(--el-fill-color-light);
    line-height: 1.8;
    color: var(--el-text-color-regular);

    :deep(h2),
    :deep(h3) {
      margin: 12px 0 8px;
    }

    :deep(blockquote) {
      margin: 10px 0;
      padding: 8px 12px;
      border-left: 3px solid var(--el-color-primary);
      background: var(--el-color-primary-light-9);
      color: var(--el-text-color-secondary);
    }

    :deep(code) {
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--el-fill-color-darker, #f0f0f0);
      font-family: 'JetBrains Mono', Consolas, monospace;
      font-size: 12px;
    }
  }
}

@media (max-width: 760px) {
  .publish-page__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .publish-page__capabilities {
    justify-content: flex-start;
  }

  .publish-page__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
