<template>
  <page-wrapper class="route-overview-page">
    <g-page-header
      title="Route Engine 概览"
      description="路由只描述页面能力，菜单只负责展示，权限只负责准入。"
      :icon="Monitor"
    >
      <template #actions>
        <el-tag effect="plain" type="primary">动态路由</el-tag>
        <el-tag effect="plain" type="success">菜单投影</el-tag>
      </template>
    </g-page-header>

    <g-page-stats :columns="3">
      <pro-statistic-card title="路由层级" :value="4" description="Layout / Page / Child / Blank" />
      <pro-statistic-card title="处理阶段" :value="5" description="从原始定义到可访问路由" />
      <pro-statistic-card title="菜单来源" value="meta" description="展示字段可由 meta.menu 覆盖" />
    </g-page-stats>

    <pro-card title="处理流程" subtitle="示例页用于验证框架约定是否稳定">
      <div class="flow-grid">
        <div v-for="item in flow" :key="item.title" class="flow-card">
          <div class="flow-index">{{ item.index }}</div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
          <el-tag size="small" effect="plain">{{ item.tag }}</el-tag>
        </div>
      </div>
    </pro-card>

    <pro-card title="建议约定">
      <div class="rule-grid">
        <div v-for="item in rules" :key="item.label" class="rule-item">
          <strong>{{ item.label }}</strong>
          <span>{{ item.value }}</span>
        </div>
      </div>
    </pro-card>
  </page-wrapper>
</template>

<script setup lang="ts">
import { Monitor } from '@element-plus/icons-vue'
import { GPageHeader, GPageStats, PageWrapper } from '@/components'

const flow = [
  {
    index: '01',
    title: 'Normalize',
    desc: '补齐 Layout、BlankContainer、redirect 与路径信息，保证后续处理输入稳定。',
    tag: '结构标准化'
  },
  {
    index: '02',
    title: 'Authorize',
    desc: '根据 permissionMode、ignoreAuth、登录态与权限集合过滤可访问路由。',
    tag: '准入控制'
  },
  {
    index: '03',
    title: 'Menu Project',
    desc: '把路由投影成菜单，处理 title、icon、order、hidden 与单子节点提升。',
    tag: '菜单投影'
  },
  {
    index: '04',
    title: 'Register',
    desc: '动态 addRoute 并补充 fallback，避免权限路由刷新后丢失页面入口。',
    tag: '动态注册'
  }
]

const rules = [
  { label: '路由定义', value: '优先使用 defineRoutes / defineRoute，不手写空 component' },
  { label: '菜单控制', value: '统一用 meta.menu 覆盖展示字段，meta.title/icon 作为兜底' },
  { label: '开放页面', value: '登录、异常、文档和演示页显式声明 meta.ignoreAuth' },
  { label: '缓存页面', value: '只在业务页设置 meta.isKeepAlive，避免缓存容器页' }
]
</script>

<style lang="scss" scoped>
.route-overview-page {
  gap: 16px;
}

.flow-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.flow-card {
  position: relative;
  padding: 16px 20px;
  border: 1px solid var(--global-border-color);
  border-radius: 8px;
  background: var(--global-surface-color-muted);

  h3 {
    margin: 0 0 12px;
    color: var(--global-heading-color);
    font-size: 15px;
  }

  p {
    min-height: 74px;
    margin: 0 0 16px;
    color: var(--global-text-color-secondary);
    line-height: 1.7;
  }
}

.flow-index {
  position: absolute;
  top: 18px;
  right: 24px;
  color: var(--global-text-color-placeholder);
  font-size: 24px;
  font-weight: 700;
}

.rule-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.rule-item {
  border: 1px solid var(--global-border-color);
  border-radius: 8px;
  padding: 14px 16px;
  background: var(--global-surface-color-muted);

  strong {
    display: block;
    margin-bottom: 8px;
    color: var(--global-heading-color);
  }

  span {
    color: var(--global-text-color-secondary);
    line-height: 1.6;
  }
}

@media (max-width: 1200px) {
  .flow-grid,
  .rule-grid {
    grid-template-columns: 1fr;
  }
}
</style>
