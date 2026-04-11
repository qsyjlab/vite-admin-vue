<template>
  <page-wrapper>
    <page-card header="Route Engine 概览" style="margin-bottom: 16px">
      <el-alert
        title="这组页面用于演示：路由定义 -> 权限过滤 -> 菜单投影 -> 动态注册 的完整链路"
        type="success"
        :closable="false"
      />
    </page-card>

    <page-card header="内部流程" style="margin-bottom: 16px">
      <el-timeline>
        <el-timeline-item timestamp="1" placement="top"
          >normalize：补全 Layout / BlankContainer / redirect</el-timeline-item
        >
        <el-timeline-item timestamp="2" placement="top"
          >authorize：按 permissionMode + ignoreAuth 过滤</el-timeline-item
        >
        <el-timeline-item timestamp="3" placement="top"
          >menuProject：路由投影成菜单并处理 hideInMenu/order</el-timeline-item
        >
        <el-timeline-item timestamp="4" placement="top"
          >transform：扁平化 + 路径拼接 + keepalive name 处理</el-timeline-item
        >
        <el-timeline-item timestamp="5" placement="top"
          >register：addRoute 动态注册并补 404 fallback</el-timeline-item
        >
      </el-timeline>
    </page-card>

    <page-card header="建议约定">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="路由定义"
          >优先使用 defineRoutes/defineRoute，不手写空 component</el-descriptions-item
        >
        <el-descriptions-item label="菜单控制"
          >统一走 meta.menu（title/icon/order/hidden）覆盖</el-descriptions-item
        >
        <el-descriptions-item label="开放页"
          >无需登录页面显式写 meta.ignoreAuth = true</el-descriptions-item
        >
        <el-descriptions-item label="缓存页"
          >只在业务页设置 meta.isKeepAlive，避免容器级缓存</el-descriptions-item
        >
      </el-descriptions>
    </page-card>
  </page-wrapper>
</template>

<script setup lang="ts"></script>
