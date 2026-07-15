<template>
  <div class="auth-page">
    <!-- 左侧品牌展示区（纯展示，无功能） -->
    <aside class="auth-brand">
      <div class="auth-brand__inner">
        <header class="auth-brand__header">
          <div class="auth-brand__logo">
            <el-icon :size="28"><Platform /></el-icon>
          </div>
          <span class="auth-brand__title">{{ config.projectTitle }}</span>
        </header>

        <div class="auth-brand__hero">
          <h1 class="auth-brand__headline">中后台权限框架<br />三模式演示</h1>
          <p class="auth-brand__desc">{{ config.projectDesc }}</p>

          <ul class="auth-brand__features">
            <li>
              <el-icon :size="16"><Check /></el-icon> 路由 name 映射 — 按路由名过滤
            </li>
            <li>
              <el-icon :size="16"><Check /></el-icon> 角色映射 — 按 meta.roles 过滤
            </li>
            <li>
              <el-icon :size="16"><Check /></el-icon> 菜单映射 — 后端返回菜单树
            </li>
          </ul>
        </div>

        <footer class="auth-brand__footer">
          <span>Mock 演示环境 · 账号 admin / editor / viewer · 密码 123456</span>
        </footer>
      </div>
    </aside>

    <!-- 右侧登录表单区 -->
    <main class="auth-form">
      <div class="auth-form__inner">
        <pro-card bordered shadow="hover" :body-padding="'40px 36px'" class="auth-form__card">
          <!-- 标题 -->
          <div class="auth-form__header">
            <h2 class="auth-form__heading">登录</h2>
            <p class="auth-form__subheading">选择账号并登录体验不同权限</p>
          </div>

          <!-- 表单 -->
          <el-form :model="loginForm" size="large" class="auth-form__form">
            <!-- 快捷选择账号下拉 -->
            <el-form-item>
              <el-select
                v-model="selectedUsername"
                class="auth-form__account-select"
                popper-class="auth-account-popper"
                placeholder="快捷选择账号"
                @change="handleAccountChange"
              >
                <template #prefix>
                  <div
                    v-if="selectedAccount"
                    class="account-avatar account-avatar--sm"
                    :style="{ background: selectedAccount.color }"
                  >
                    {{ selectedAccount.realName.charAt(0) }}
                  </div>
                  <el-icon v-else :size="16"><UserFilled /></el-icon>
                </template>
                <el-option
                  v-for="user in accountPresets"
                  :key="user.username"
                  :label="user.realName"
                  :value="user.username"
                >
                  <div class="account-option">
                    <div class="account-avatar" :style="{ background: user.color }">
                      {{ user.realName.charAt(0) }}
                    </div>
                    <div class="account-option__info">
                      <span class="account-option__name">{{ user.realName }}</span>
                      <span class="account-option__role">{{ user.roleLabel }}</span>
                    </div>
                    <el-tag size="small" type="info" effect="plain" round>
                      {{ user.username }}
                    </el-tag>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-input v-model="loginForm.username" :prefix-icon="User" placeholder="用户名" />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="loginForm.password"
                :prefix-icon="Lock"
                show-password
                type="password"
                placeholder="密码"
                @keyup.enter="loginAdmin"
              />
            </el-form-item>

            <!-- 权限模式下拉选择 -->
            <el-form-item>
              <el-select
                v-model="currentMode"
                class="auth-form__mode-select"
                placeholder="选择权限模式"
                @change="handleModeChange"
              >
                <template #prefix>
                  <el-icon :size="16"><Setting /></el-icon>
                </template>
                <el-option
                  v-for="mode in modeOptions"
                  :key="mode.value"
                  :label="mode.label"
                  :value="mode.value"
                >
                  <div class="mode-option">
                    <span class="mode-option__label">{{ mode.label }}</span>
                    <span class="mode-option__desc">{{ mode.desc }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                class="auth-form__submit"
                type="primary"
                :loading="loading"
                @click="loginAdmin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 当前模式提示 -->
          <div class="auth-form__mode-hint">
            <el-icon :size="14"><InfoFilled /></el-icon>
            <span>{{ currentModeDesc }}</span>
          </div>
        </pro-card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useUserStore, usePermissionStore } from '@/store'
import { ElMessage } from 'element-plus'
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import config from '@/config'
import {
  Lock,
  User,
  Platform,
  Check,
  InfoFilled,
  Setting,
  UserFilled
} from '@element-plus/icons-vue'
import { PermissionModeEnum } from '@/enum'
import { ProCard } from '@framebase/element-plus-pro-components'
import { mockUsers } from '@/mocks/data/auth'

const { loginSystem, loginOutSystem } = useUserStore()
const permissionStore = usePermissionStore()
const router = useRouter()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const currentMode = ref<keyof typeof PermissionModeEnum>(permissionStore.getPermissionMode())

// ─── 权限模式下拉选项 ──────────────────────────────────────────

const modeOptions = [
  {
    value: 'ROUTE_MAPPING' as const,
    label: '路由 name 映射',
    desc: '按用户拥有的路由 name 列表过滤菜单与路由'
  },
  {
    value: 'ROLE' as const,
    label: '角色映射',
    desc: '按路由 meta.roles 过滤访问权限，父路由不匹配时整棵子树移除'
  },
  {
    value: 'BACKED' as const,
    label: '菜单映射（后端菜单）',
    desc: '后端返回菜单树，前端 transformObjToRoute 动态渲染路由'
  }
]

const currentModeDesc = computed(() => {
  return modeOptions.find(m => m.value === currentMode.value)?.desc || ''
})

// ─── 账号预设 ────────────────────────────────────────────────

const roleLabels: Record<string, string> = {
  admin: '超级管理员 · 全部权限',
  editor: '编辑者 · 部分权限',
  viewer: '访客 · 最小权限'
}
const avatarColors: Record<string, string> = {
  admin: 'linear-gradient(135deg, #667eea, #764ba2)',
  editor: 'linear-gradient(135deg, #f093fb, #f5576c)',
  viewer: 'linear-gradient(135deg, #4facfe, #00f2fe)'
}

const accountPresets = mockUsers.map(u => ({
  username: u.username,
  password: u.password,
  realName: u.realName,
  roleLabel: roleLabels[u.username] || u.desc,
  color: avatarColors[u.username] || 'linear-gradient(135deg, #667eea, #764ba2)'
}))

// 当前选中的账号（用于下拉 prefix 头像展示）
const selectedUsername = ref<string>('admin')
const selectedAccount = computed(() =>
  accountPresets.find(u => u.username === selectedUsername.value)
)

// ─── 生命周期 ────────────────────────────────────────────────

onMounted(() => {
  loginOutSystem()
})

// ─── 事件处理 ────────────────────────────────────────────────

function handleModeChange(mode: keyof typeof PermissionModeEnum) {
  permissionStore.setPermissionMode(mode)
  ElMessage.info(`已切换到「${modeOptions.find(m => m.value === mode)?.label}」模式`)
}

function handleAccountChange(username: string) {
  const user = accountPresets.find(u => u.username === username)
  if (user) {
    loginForm.username = user.username
    loginForm.password = user.password
  }
}

const loginAdmin = async () => {
  loading.value = true
  try {
    await loginSystem(loginForm)
    const redirect = router.currentRoute.value.query.redirect as string
    ElMessage.success('登录成功')
    if (redirect) {
      router.replace(redirect)
    } else {
      router.replace({ name: 'Welcome' })
    }
  } catch {
    ElMessage.error('登录失败，请检查账号密码')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
// ─── 响应式断点 ──────────────────────────────────────────────
$breakpoint-tablet: 960px;

.auth-page {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f0f2f5;
}

// ─── 左侧品牌区（纯展示） ────────────────────────────────────

.auth-brand {
  flex: 1.1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(100, 126, 234, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -15%;
    left: -5%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(118, 75, 162, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  &__inner {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__logo {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--el-color-primary), #667eea);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 4px 12px rgba(100, 126, 234, 0.4);
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.5px;
  }

  &__hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__headline {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    line-height: 1.35;
    margin: 0 0 16px;
    letter-spacing: 1px;
  }

  &__desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.55);
    line-height: 1.7;
    margin: 0 0 28px;
  }

  &__features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);

      .el-icon {
        color: #4facfe;
      }
    }
  }

  &__footer {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    line-height: 1.6;
  }
}

// ─── 右侧表单区 ──────────────────────────────────────────────

.auth-form {
  flex: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8fa;

  &__inner {
    width: 100%;
    max-width: 420px;
    padding: 40px 24px;
  }

  &__card {
    border-radius: 12px !important;
  }

  &__header {
    text-align: center;
    margin-bottom: 28px;
  }

  &__heading {
    font-size: 24px;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin: 0 0 6px;
  }

  &__subheading {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    margin: 0;
  }

  &__section {
    margin-bottom: 20px;
  }

  &__label {
    font-size: 13px;
    font-weight: 500;
    color: var(--el-text-color-secondary);
    margin-bottom: 10px;
  }

  &__divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    color: var(--el-text-color-placeholder);
    font-size: 12px;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--el-border-color-lighter);
    }

    span {
      padding: 0 14px;
    }
  }

  &__form {
    :deep(.el-input__wrapper) {
      border-radius: 8px;
    }

    :deep(.el-select .el-select__wrapper) {
      border-radius: 8px;
    }
  }

  &__account-select,
  &__mode-select {
    width: 100%;
  }

  &__submit {
    width: 100%;
    border-radius: 8px;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 1px;
  }

  &__mode-hint {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-top: 20px;
    padding: 10px 14px;
    border-radius: 8px;
    background: var(--el-color-primary-light-9);
    font-size: 12px;
    color: var(--el-text-color-secondary);
    line-height: 1.5;

    .el-icon {
      flex-shrink: 0;
      margin-top: 2px;
    }
  }
}

// ─── 账号头像（下拉 prefix + 选项共用） ─────────────────────

.account-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;

  &--sm {
    width: 24px;
    height: 24px;
    font-size: 11px;
    border-radius: 50%;
  }
}

// ─── 账号下拉选项 ────────────────────────────────────────────

.account-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__name {
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    line-height: 1.2;
  }

  &__role {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    line-height: 1.2;
  }
}

// ─── 模式下拉选项 ────────────────────────────────────────────

.mode-option {
  display: flex;
  flex-direction: column;
  gap: 2px;

  &__label {
    font-size: 14px;
    font-weight: 500;
  }

  &__desc {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

// ─── 响应式 ──────────────────────────────────────────────────

@media (max-width: $breakpoint-tablet) {
  .auth-brand {
    display: none;
  }

  .auth-form {
    flex: 1;
  }
}
</style>

<!-- 非 scoped：el-select 下拉面板渲染在 body 下，需全局样式覆盖 -->
<style lang="scss">
.auth-account-popper {
  // 加大选项高度，容纳头像 + 双行文本
  .el-select-dropdown__item {
    height: auto;
    line-height: 1.4;
    padding: 8px 12px;
  }
}
</style>
