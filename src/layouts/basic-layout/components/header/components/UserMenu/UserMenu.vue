<template>
  <el-dropdown style="height: 100%">
    <hover-card style="height: 100%">
      <span class="el-dropdown-link"> {{ userInfo.userName }} </span>
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

const { loginOutSystem, userInfo } = useUserStore()

const logout = () => {
  loginOutSystem()
}
</script>
