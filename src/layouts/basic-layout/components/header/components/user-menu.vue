<template>
  <el-dropdown style="height: 100%">
    <el-button class="user-trigger" text>
      <el-avatar
        :size="32"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
      <span class="user-trigger__name">{{ userInfo.userName }}</span>
    </el-button>

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

<style lang="scss" scoped>
.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  padding: 0 10px 0 6px;
  border-radius: 999px;
  color: var(--global-heading-color);
  border: 1px solid var(--global-border-color);
  background: rgba(255, 255, 255, 0.92);

  &:hover,
  &:focus {
    border-color: #cddcff;
    background: #eef4ff;
    color: var(--el-color-primary);
  }

  &__name {
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
  }
}
</style>
