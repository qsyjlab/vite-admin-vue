<template>
  <page-wrapper>
    <page-card header="菜单投影与覆盖示例" style="margin-bottom: 16px">
      <el-alert
        title="推荐只保留一套来源：meta.menu 作为菜单覆盖项，meta.title/icon 作为兜底。"
        type="warning"
        :closable="false"
      />
    </page-card>

    <page-card header="字段映射" style="margin-bottom: 16px">
      <el-table :data="mappingRows" border>
        <el-table-column prop="source" label="输入字段" min-width="220" />
        <el-table-column prop="target" label="菜单字段" min-width="160" />
        <el-table-column prop="note" label="说明" min-width="260" />
      </el-table>
    </page-card>

    <page-card header="实践建议">
      <el-space direction="vertical" alignment="start" fill>
        <el-tag>菜单隐藏：使用 meta.menu.hidden，减少 hideInMenu 与 menu 重复配置</el-tag>
        <el-tag type="success">菜单排序：只在同级用 order，跨级不要比较大小</el-tag>
        <el-tag type="danger">单子节点提升要谨慎：仅在非业务分组路由启用</el-tag>
      </el-space>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts">
const mappingRows = [
  {
    source: 'meta.menu.title ?? meta.title',
    target: 'menu.title',
    note: '优先菜单标题，兜底路由标题'
  },
  {
    source: 'meta.menu.icon ?? meta.icon',
    target: 'menu.icon',
    note: '图标覆盖与路由图标保持兼容'
  },
  {
    source: 'meta.menu.order ?? meta.order',
    target: 'menu.order',
    note: '排序仅对同级生效'
  },
  {
    source: 'meta.menu.hidden ?? meta.hideInMenu',
    target: 'menu.hidden',
    note: '建议逐步收敛到 menu.hidden'
  },
  {
    source: 'meta.menu.hideChildrenInMenu ?? meta.hideChildrenInMenu',
    target: 'menu.hideChildrenInMenu',
    note: '用于父级是否折叠展示子菜单'
  }
]
</script>
