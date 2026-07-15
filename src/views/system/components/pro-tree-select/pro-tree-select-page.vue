<template>
  <page-wrapper :full="false" class="tree-select-page">
    <header class="component-page-header">
      <div>
        <h1>ProTreeSelect</h1>
        <p>支持字段映射、远程整树请求、异步选中路径回显和 Ref 重载。</p>
      </div>
      <el-tag :type="lifecycle.phase === 'error' ? 'danger' : 'success'" effect="plain">
        {{ lifecycle.phase }}
      </el-tag>
    </header>

    <div class="demo-grid">
      <section class="demo-panel">
        <div class="demo-panel__header">
          <div>
            <h2>静态组织树</h2>
            <p>自定义 id / name / nodes 字段映射。</p>
          </div>
          <span>{{ staticValue || '未选择' }}</span>
        </div>
        <pro-tree-select
          v-model="staticValue"
          :data="organizationTree"
          :fields="{ key: 'id', label: 'name', children: 'nodes' }"
          node-key="id"
          placeholder="选择业务团队"
        />
      </section>

      <section class="demo-panel">
        <div class="demo-panel__header">
          <div>
            <h2>异步路径回显</h2>
            <p>初始值在整树返回前，通过 pathRequest 先补全标签。</p>
          </div>
          <span>{{ remoteValue || '未选择' }}</span>
        </div>
        <pro-tree-select
          ref="treeSelectRef"
          v-model="remoteValue"
          :request="requestOrganization"
          :path-request="requestSelectedPath"
          :fields="{ key: 'id', label: 'name', children: 'nodes' }"
          node-key="id"
          check-strictly
          placeholder="远程加载组织成员"
          @request-state-change="value => (lifecycle = value)"
        />
        <div class="demo-panel__actions">
          <el-button @click="reloadTree">重新加载整树</el-button>
          <el-button @click="reloadPath">刷新选中路径</el-button>
          <el-button @click="cancelRequest">取消请求</el-button>
        </div>
      </section>
    </div>

    <section class="path-panel">
      <span>当前异步路径</span>
      <strong>{{ selectedPathText }}</strong>
      <p>即使节点尚未进入主树，cache-data 也能稳定显示选中项名称。</p>
    </section>
  </page-wrapper>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { PageWrapper } from '@/components'
import {
  ProTreeSelect,
  useProTreeSelect,
  type ProRequestContext,
  type ProRequestLifecycle,
  type ProTreeSelectInstance,
  type ProTreeSelectValue
} from '@framebase/element-plus-pro-components'

defineOptions({ name: 'ProTreeSelectPage' })

interface OrganizationNode {
  id: string
  name: string
  nodes?: OrganizationNode[]
  disabled?: boolean
}

const organizationTree: OrganizationNode[] = [
  {
    id: 'product',
    name: '产品研发中心',
    nodes: [
      { id: 'product-platform', name: '平台产品组' },
      { id: 'product-growth', name: '增长产品组' }
    ]
  },
  {
    id: 'technology',
    name: '技术中心',
    nodes: [
      { id: 'technology-frontend', name: '前端架构组' },
      { id: 'technology-data', name: '数据平台组' }
    ]
  },
  {
    id: 'customer-success',
    name: '客户成功中心',
    nodes: [{ id: 'customer-east', name: '华东客户组' }]
  }
]

const remoteTree: OrganizationNode[] = [
  {
    id: 'product',
    name: '产品研发中心',
    nodes: [
      { id: 'member-101', name: '陈晨 · 产品负责人' },
      { id: 'member-102', name: '李娜 · 产品经理' }
    ]
  },
  {
    id: 'technology',
    name: '技术中心',
    nodes: [
      { id: 'member-203', name: '王强 · 架构师' },
      { id: 'member-204', name: '赵敏 · 前端负责人' }
    ]
  }
]

const staticValue = ref<string>()
const remoteValue = ref<string>('member-204')
const lifecycle = ref<ProRequestLifecycle>({
  phase: 'idle',
  loading: false,
  initialLoading: false,
  refreshing: false
})
const treeSelectRef = useTemplateRef<ProTreeSelectInstance<OrganizationNode>>('treeSelectRef')
const treeSelect = useProTreeSelect(treeSelectRef)
const selectedPath = ref<OrganizationNode[]>([])
const selectedPathText = computed(
  () => selectedPath.value.map(node => node.name).join(' / ') || '等待路径加载'
)

async function requestOrganization(context: ProRequestContext) {
  await wait(520, context.signal)
  return remoteTree
}

async function requestSelectedPath(value: ProTreeSelectValue, context: ProRequestContext) {
  await wait(180, context.signal)
  const target = Array.isArray(value) ? value[0] : value
  const path = findNodePath(remoteTree, target)
  selectedPath.value = path
  return path
}

async function reloadTree() {
  await treeSelect.reload()
}

async function reloadPath() {
  await treeSelect.reloadPath()
}

async function cancelRequest() {
  await treeSelect.cancelRequest()
}

function findNodePath(nodes: OrganizationNode[], target: unknown): OrganizationNode[] {
  for (const node of nodes) {
    if (node.id === target) return [node]
    const childPath = node.nodes ? findNodePath(node.nodes, target) : []
    if (childPath.length) return [node, ...childPath]
  }
  return []
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
.tree-select-page {
  min-width: 0;
}

.component-page-header,
.demo-panel__header {
  display: flex;
  align-items: center;
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

.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.demo-panel,
.path-panel {
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color-overlay);
}

.demo-panel {
  &__header {
    align-items: flex-start;
    margin-bottom: 16px;

    h2 {
      margin: 0;
      font-size: 16px;
    }

    p {
      margin: 5px 0 0;
      color: var(--el-text-color-secondary);
      font-size: 13px;
    }

    > span {
      max-width: 42%;
      overflow: hidden;
      color: var(--el-color-primary);
      font-size: 13px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  :deep(.el-select) {
    width: 100%;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }
}

.path-panel {
  display: grid;
  gap: 8px;
  margin-top: 16px;

  span,
  p {
    color: var(--el-text-color-secondary);
    font-size: 13px;
  }

  strong {
    font-size: 18px;
  }

  p {
    margin: 0;
  }
}

@media (max-width: 760px) {
  .component-page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
