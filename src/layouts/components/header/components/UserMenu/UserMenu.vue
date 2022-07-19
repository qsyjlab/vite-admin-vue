<!--
 * @Description:用户按钮
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 11:12:36
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 16:27:34
 * @FilePath: \vite-admin-vue\src\layouts\components\header\components\UserMenu\UserMenu.vue
-->

<template>
  <el-dropdown style="height: 100%">
    <hover-card style="height: 100%">
      <span class="el-dropdown-link"> USUERMENU </span>
    </hover-card>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>个人首页</el-dropdown-item>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import { useUserStore } from '@/store'

const { loginOutSystem } = useUserStore()

const logout = () => {
  loginOutSystem()
}
</script>
<style scoped></style>
