<!--
 * @Description: 默认模板
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:59:32
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-15 16:22:06
 * @FilePath: \vite-admin-vue\src\layouts\BasicLayout\BasicLayout.vue
-->
<template>
  <BasicLayout>
    <template #aside>
      <div class="layout-aside_wapper">
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-sub-menu index="1">
            <template #title>
              <span>Navigator One</span>
            </template>
            <el-menu-item-group title="Group One">
              <el-menu-item index="1-1">item one</el-menu-item>
              <el-menu-item index="1-2">item one</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
              <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>item four</template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="2">
            <span>Navigator Two</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <span>Navigator Three</span>
          </el-menu-item>
          <el-menu-item index="4">
            <span>Navigator Four</span>
          </el-menu-item>
        </el-menu>
      </div>
    </template>
    <template #header>
      <div class="layout-header_wapper">测试内容</div>
    </template>
    <div class="layout-main_wapper">侧边栏asdasd</div>
    <template #footer>
      <div class="layout-footer_wapper">侧边栏</div>
    </template>
  </BasicLayout>
</template>

<script setup lang="ts">
// import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { BasicLayout } from '@/layouts/LayoutPackage'
</script>

<style lang="scss" scoped>
.layout-aside_wapper {
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  // padding: 10px;
}
.layout-header_wapper {
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}
.layout-main_wapper {
  // z-index: 9999;
  box-sizing: border-box;
  height: 100%;
  background-color: rgba(246, 249, 248);
  padding: 15px;
  // background-color: red;
}
</style>
