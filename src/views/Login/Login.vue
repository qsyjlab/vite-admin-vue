<!--
 * @Description:  登录页面
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 15:16:22
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 16:33:09
 * @FilePath: \vite-admin-vue\src\views\Login\Login.vue
-->
<template>
  <div class="login-container">
    <div class="login-layout-body">
      <div class="body-header">
        <div class="header-title">Basic Admin</div>
        <div class="header-desc">BasicAdmin是一个中后台管理系统模版</div>
      </div>
      <div class="form-content">
        <el-form :model="loginForm" size="large">
          <el-form-item>
            <el-input v-model="loginForm.username" prefix-icon="icon-user" />
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="loginForm.password"
              prefix-icon="icon-lock"
              show-password
              type="password"
            />
          </el-form-item>
        </el-form>
        <el-button
          size="large"
          style="width: 100%; margin-top: 15px"
          type="primary"
          @click="loginAdmin"
          >登录</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'
import { reactive } from 'vue'

const { loginSystem } = useUserStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const loginAdmin = () => {
  loginSystem(loginForm)
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
}
.login-layout-body {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  background-color: white;
  border-radius: 10px;
  width: 600px;
  padding: 25px;
  .body-header {
    text-align: center;
    margin-bottom: 40px;
  }
  .header-title {
    font-size: 30px;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .header-desc {
    color: #848587;
    font-size: 13px;
  }
  .form-content {
    padding: 0 50px;
    padding-bottom: 50px;
  }
}
</style>
