<template>
  <page-wrapper>
    <page-card header="登录与权限策略示例" style="margin-bottom: 16px">
      <el-alert
        title="当前项目规则：ignoreAuth 或白名单可直接访问；其余页面先校验 token，再校验动态权限。"
        type="info"
        :closable="false"
      />
    </page-card>

    <page-card header="建议分层" style="margin-bottom: 16px">
      <el-table :data="rows" border>
        <el-table-column prop="layer" label="层级" min-width="120" />
        <el-table-column prop="rule" label="规则" min-width="320" />
        <el-table-column prop="example" label="示例" min-width="200" />
      </el-table>
    </page-card>

    <page-card header="落地建议">
      <el-space direction="vertical" alignment="start" fill>
        <el-tag type="success">公开页面：登录、404、文档、演示页都显式标记 ignoreAuth</el-tag>
        <el-tag type="warning"
          >权限页面：使用 name 作为权限 key，避免 path 变化导致权限串失效</el-tag
        >
        <el-tag>后端路由模式：仅负责授权，前端仍保留菜单渲染和路由容错能力</el-tag>
      </el-space>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
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
</script>
