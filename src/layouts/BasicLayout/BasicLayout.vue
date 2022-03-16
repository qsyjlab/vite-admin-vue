<!--
 * @Description: 默认模板
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 14:59:32
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 10:46:08
 * @FilePath: \vite-admin-vue\src\layouts\BasicLayout\BasicLayout.vue
-->
<template>
  <BasicLayout>
    <template #aside>
      <div class="layout-aside_wapper">
        <aside-menu :menu-list="menuList"></aside-menu>
      </div>
    </template>
    <template #header>
      <div class="layout-header_wapper">测试内容</div>
    </template>
    <div class="layout-main_wapper">
      <router-view></router-view>
    </div>
    <template #footer>
      <div class="layout-footer_wapper">侧边栏</div>
    </template>
  </BasicLayout>
</template>

<script setup lang="ts">
import { BasicLayout } from '@/layouts/LayoutPackage'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { AsideMenu } from '../components'

const store = useStore()

// 获取菜单列表
const menuList = computed(() => store.state.route.menuList)
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
