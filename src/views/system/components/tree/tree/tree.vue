<template>
  <page-wrapper :full="false" class="pro-tree-page">
    <header class="component-page-header">
      <div>
        <h1>ProTree</h1>
        <p>远程组织树、搜索、受控勾选、错误重试和 Ref 操作。</p>
      </div>
      <el-tag :type="lifecycle.phase === 'error' ? 'danger' : 'success'" effect="plain">
        {{ lifecycle.phase }}
      </el-tag>
    </header>

    <section class="tree-panel">
      <div class="tree-toolbar">
        <div>
          <strong>组织权限范围</strong>
          <span>已选择 {{ checkedKeys.length }} 个节点</span>
        </div>
        <div class="tree-toolbar__actions">
          <el-button @click="tree.expandAll()">全部展开</el-button>
          <el-button @click="tree.collapseAll()">全部收起</el-button>
          <el-button type="primary" @click="reloadTree">重新加载</el-button>
          <el-button type="danger" plain @click="simulateFailure">模拟失败</el-button>
        </div>
      </div>

      <pro-tree
        ref="treeRef"
        v-model="checkedKeys"
        v-model:current-key="currentKey"
        :request="requestTree"
        :fields="{ key: 'id', label: 'name', children: 'children' }"
        node-key="id"
        checkable
        searchable
        default-expand-all
        @request-state-change="value => (lifecycle = value)"
      />
    </section>

    <section class="selection-panel">
      <div>
        <span>当前节点</span><strong>{{ currentKey || '未选择' }}</strong>
      </div>
      <div>
        <span>勾选节点</span><strong>{{ checkedKeys.join('、') || '未选择' }}</strong>
      </div>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { PageWrapper } from '@/components'
import {
  ProTree,
  useProTree,
  type ProRequestContext,
  type ProTreeInstance,
  type ProTreeRequestLifecycle
} from '@framebase/element-plus-pro-components'

defineOptions({ name: 'ProTreePage' })

interface OrganizationNode {
  id: string
  name: string
  children?: OrganizationNode[]
}

const organizationData: OrganizationNode[] = [
  {
    id: 'product',
    name: '产品研发中心',
    children: [
      { id: 'product-platform', name: '平台产品组' },
      { id: 'product-growth', name: '增长产品组' }
    ]
  },
  {
    id: 'technology',
    name: '技术中心',
    children: [
      { id: 'technology-frontend', name: '前端架构组' },
      { id: 'technology-data', name: '数据平台组' }
    ]
  },
  {
    id: 'customer-success',
    name: '客户成功中心',
    children: [
      { id: 'customer-east', name: '华东客户组' },
      { id: 'customer-south', name: '华南客户组' }
    ]
  }
]

const checkedKeys = ref<Array<string | number>>(['technology-frontend'])
const currentKey = ref<string | number>()
const failNextRequest = ref(false)
const lifecycle = ref<ProTreeRequestLifecycle>({
  phase: 'idle',
  loading: false,
  initialLoading: false,
  refreshing: false
})
const treeRef = useTemplateRef<ProTreeInstance<OrganizationNode>>('treeRef')
const tree = useProTree(treeRef)

async function requestTree(context: ProRequestContext) {
  await wait(320, context.signal)
  if (failNextRequest.value) {
    failNextRequest.value = false
    throw new Error('组织服务暂时不可用')
  }
  return organizationData
}

async function reloadTree() {
  await tree.reload()
}

async function simulateFailure() {
  failNextRequest.value = true
  await tree.reload().catch(() => undefined)
}

function wait(delay: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, delay)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true }
    )
  })
}
</script>

<style scoped lang="scss">
.pro-tree-page {
  min-width: 0;
}

.component-page-header,
.tree-toolbar,
.tree-toolbar > div,
.tree-toolbar__actions {
  display: flex;
  align-items: center;
}

.component-page-header,
.tree-toolbar {
  justify-content: space-between;
  gap: 16px;
}

.component-page-header {
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

.tree-panel,
.selection-panel {
  padding: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color-overlay);
}

.tree-toolbar {
  margin-bottom: 16px;

  > div,
  &__actions {
    flex-wrap: wrap;
    gap: 8px;
  }

  span {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }
}

.selection-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;

  div {
    display: grid;
    min-width: 0;
    gap: 6px;
  }

  span {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  strong {
    overflow-wrap: anywhere;
  }
}

@media (max-width: 760px) {
  .component-page-header,
  .tree-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .selection-panel {
    grid-template-columns: 1fr;
  }
}
</style>
