<template>
  <div class="login-container">
    <div class="login-layout-body">
      <div class="login-exhibit">
        <div class="header-title">{{ config.projectTitle }}</div>
        <div class="header-desc">{{ config.projectDesc }}</div>
      </div>
      <div class="form-content">
        <div class="form-content-wrapper">
          <div class="form-title">登录 {{ config.projectTitle }}</div>

          <el-form :model="loginForm" size="large">
            <el-form-item>
              <el-input
                v-model="loginForm.username"
                :prefix-icon="User"
                placeholder="请输入用户名"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="loginForm.password"
                :prefix-icon="Lock"
                show-password
                type="password"
                placeholder="请输入密码"
              />
            </el-form-item>
            <el-form-item>
              <el-button style="width: 100%; margin-top: 15px" type="primary" @click="loginAdmin"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import config from '@/config'
import { Lock, User } from '@element-plus/icons-vue'

const { loginSystem } = useUserStore()

const loginForm = reactive({
  username: 'admin',
  password: '123456'
})
const router = useRouter()

const loginAdmin = () => {
  loginSystem(loginForm).then(() => {
    const redirect = router.currentRoute.value.query.redirect as string
    ElMessage.success('登录成功')
    if (redirect) {
      router.replace(redirect)
    } else {
      router.replace({ name: 'Welcome' })
    }
  })
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
  overflow: hidden;
  background-color: #e9edf1;
}

.login-layout-body {
  display: flex;
  width: 60vw;
  height: 70vh;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  box-sizing: border-box;
  background-color: white;
  border-radius: 7px;
  overflow: hidden;
  .login-exhibit {
    width: 48%;
    height: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    // background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    background: linear-gradient(163.85deg, #1d2129 0%, var(--el-color-primary) 100%);
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
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .form-title {
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
      color: rgb(29, 33, 41);
      padding-bottom: 30px;
    }

    &-wrapper {
      width: 100%;
      padding: 0 19%;
      box-sizing: border-box;
    }
  }
}
</style>
