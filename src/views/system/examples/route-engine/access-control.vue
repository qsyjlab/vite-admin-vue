<template>
  <page-wrapper>
    <page-card header="登录与权限策略" style="margin-bottom: 16px">
      <div class="access-summary">
        <div v-for="item in summary" :key="item.title" class="summary-item">
          <el-tag :type="item.type" effect="light">{{ item.badge }}</el-tag>
          <strong>{{ item.title }}</strong>
          <span>{{ item.desc }}</span>
        </div>
      </div>
    </page-card>

    <page-card header="准入链路" style="margin-bottom: 16px">
      <el-table :data="rows" border>
        <el-table-column prop="layer" label="层级" min-width="120" />
        <el-table-column prop="rule" label="规则" min-width="320" />
        <el-table-column prop="example" label="示例" min-width="220" />
      </el-table>
    </page-card>

    <page-card header="落地建议">
      <div class="tip-list">
        <div v-for="item in tips" :key="item.title" class="tip-item">
          <strong>{{ item.title }}</strong>
          <span>{{ item.desc }}</span>
        </div>
      </div>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
const summary = [
  {
    badge: 'public',
    type: 'success' as const,
    title: '公开页面',
    desc: '登录、404、文档、演示页通过 ignoreAuth 或白名单直接访问。'
  },
  {
    badge: 'token',
    type: 'warning' as const,
    title: '登录态',
    desc: '业务页先校验 token，未登录时带 redirect 回跳登录页。'
  },
  {
    badge: 'permission',
    type: 'info' as const,
    title: '权限路由',
    desc: '动态路由根据角色或映射表过滤，只注册当前用户可见页面。'
  }
]

const rows = [
  {
    layer: '白名单',
    rule: 'LOGIN_NAME / WHITE_NAME_LIST 直接放行',
    example: '/login'
  },
  {
    layer: '路由元信息',
    rule: 'meta.ignoreAuth = true 跳过登录与权限拦截',
    example: '/about/about'
  },
  {
    layer: '登录态',
    rule: '无 token 时回跳登录并附带 redirect',
    example: '/components/pro-table/pro-table-basic'
  },
  {
    layer: '授权层',
    rule: 'ROUTE_MAPPING 或 ROLE 模式过滤动态路由',
    example: 'permissionStore.loadDynamicRoutes'
  }
]

const tips = [
  {
    title: '权限 key',
    desc: '使用 route.name 作为权限 key，避免 path 调整后权限串失效。'
  },
  {
    title: '后端路由',
    desc: '后端只负责授权与菜单数据，前端保留路由容错、布局和异常页兜底能力。'
  },
  {
    title: '开放页面',
    desc: '所有公开页显式写 ignoreAuth，减少白名单散落在不同模块。'
  }
]
</script>

<style lang="scss" scoped>
.access-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.summary-item,
.tip-item {
  border: 1px solid var(--global-border-color);
  border-radius: 8px;
  background: var(--global-surface-color-muted);
}

.summary-item {
  min-height: 120px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  strong {
    color: var(--global-heading-color);
    font-size: 16px;
  }

  span {
    color: var(--global-text-color-secondary);
    line-height: 1.7;
  }
}

.tip-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.tip-item {
  padding: 14px 16px;

  strong {
    display: block;
    margin-bottom: 8px;
    color: var(--global-heading-color);
  }

  span {
    color: var(--global-text-color-secondary);
    line-height: 1.7;
  }
}

@media (max-width: 1200px) {
  .access-summary,
  .tip-list {
    grid-template-columns: 1fr;
  }
}
</style>
