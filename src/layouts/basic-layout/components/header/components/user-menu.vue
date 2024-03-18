<template>
  <el-dropdown style="height: 100%">
    <el-button type="primary" text>
      <el-space>
        <el-avatar
          :size="32"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" /></el-space
      ><span> {{ userInfo.userName }} </span></el-button
    >

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
import { useRouter } from 'vue-router'

const { loginOutSystem, userInfo } = useUserStore()
const router = useRouter()

const logout = () => {
  loginOutSystem()

  // 需要做登录后的从定向操作
  router.push({ name: 'Login' })
}
</script>
