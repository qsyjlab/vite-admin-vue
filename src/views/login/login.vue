<template>
  <div class="auth-page" :class="{ 'is-dark': currentIsDark }" :style="derivedCssVars">
    <!-- 整页背景渐变层（毛玻璃的"景色"来源） -->
    <div class="auth-page__bg" aria-hidden="true">
      <div class="bg-blob bg-blob--a"></div>
      <div class="bg-blob bg-blob--b"></div>
      <div class="bg-blob bg-blob--c"></div>
      <div class="bg-grain"></div>
    </div>

    <!-- 右上角颜色预设条 + 暗黑切换 -->
    <div class="auth-topbar" role="toolbar" aria-label="主题设置">
      <div class="color-swatches">
        <button
          v-for="swatch in swatches"
          :key="swatch.color"
          class="swatch"
          :class="{ 'is-active': themeColor === swatch.color }"
          :style="{ '--sw': swatch.color }"
          :aria-label="`切换主题色${swatch.name}`"
          :title="swatch.name"
          @click="handleSetThemeColor(swatch.color)"
        >
          <span v-if="themeColor === swatch.color" class="swatch__check">
            <el-icon><Check /></el-icon>
          </span>
        </button>
      </div>

      <div class="topbar__divider" aria-hidden="true"></div>

      <button
        class="icon-btn"
        :aria-label="currentIsDark ? '切换为亮色模式' : '切换为暗黑模式'"
        :title="currentIsDark ? '切换为亮色模式' : '切换为暗黑模式'"
        @click="handleToggleDark"
      >
        <el-icon>
          <component :is="currentIsDark ? Sunny : Moon" />
        </el-icon>
      </button>
    </div>

    <aside class="auth-brand">
      <div class="auth-brand__inner">
        <div class="auth-brand__top">
          <div class="auth-brand__logo">
            <el-icon :size="22"><Platform /></el-icon>
          </div>
          <span class="auth-brand__title">{{ config.projectTitle }}</span>
        </div>

        <div class="auth-brand__hero">
          <span class="auth-brand__accent" aria-hidden="true">
            <span class="accent__bar accent__bar--primary"></span>
            <span class="accent__bar accent__bar--soft"></span>
            <span class="accent__bar accent__bar--faint"></span>
          </span>

          <h1 class="auth-brand__headline">
            <span class="headline__text">欢迎使用您的工作空间</span>
          </h1>

          <div class="auth-brand__divider" aria-hidden="true">
            <span class="divider__line divider__line--short"></span>
            <span class="divider__dot"></span>
            <span class="divider__line divider__line--long"></span>
          </div>

          <p class="auth-brand__desc">
            一个简洁、高效、面向团队协作的统一管理入口，登录后即可开始您的日常工作。
          </p>
        </div>

        <div class="auth-brand__footer">
          <span>Mock 环境 · admin / editor / viewer · 密码 123456</span>
        </div>
      </div>
    </aside>

    <main class="auth-form">
      <div class="auth-form__sheet">
        <div class="auth-form__inner">
          <div class="auth-form__header">
            <h2 class="auth-form__heading">欢迎回来</h2>
            <p class="auth-form__subheading">登录以继续使用 {{ config.projectTitle }}</p>
          </div>

          <form class="auth-form__body" @submit.prevent="loginAdmin">
            <div class="field">
              <label class="field__label">快捷账号</label>
              <el-select
                v-model="selectedUsername"
                size="large"
                placeholder="选择演示账号"
                @change="handleAccountChange"
              >
                <el-option
                  v-for="user in accountPresets"
                  :key="user.username"
                  :value="user.username"
                  :label="`${user.realName}（${user.username}）`"
                />
              </el-select>
            </div>

            <div class="field">
              <label class="field__label">用户名</label>
              <el-input
                v-model="loginForm.username"
                size="large"
                :prefix-icon="User"
                placeholder="用户名"
              />
            </div>

            <div class="field">
              <label class="field__label">密码</label>
              <el-input
                v-model="loginForm.password"
                size="large"
                :prefix-icon="Lock"
                show-password
                type="password"
                placeholder="密码"
                @keyup.enter="loginAdmin"
              />
            </div>

            <div class="field">
              <label class="field__label">权限模式</label>
              <el-select
                v-model="currentMode"
                size="large"
                placeholder="权限模式"
                @change="handleModeChange"
              >
                <el-option
                  v-for="mode in modeOptions"
                  :key="mode.value"
                  :value="mode.value"
                  :label="mode.label"
                />
              </el-select>
            </div>

            <div class="auth-form__row">
              <label class="remember">
                <el-checkbox v-model="rememberAccount" size="large" />
                <span>记住账号</span>
              </label>
              <a class="link" href="javascript:;" @click="onForgotPassword">忘记密码？</a>
            </div>

            <el-button
              class="auth-form__submit"
              type="primary"
              size="large"
              :loading="loading"
              native-type="submit"
            >
              登录
            </el-button>

            <div class="auth-form__alt-buttons">
              <el-button size="large" class="alt-btn" @click="onAltLogin('phone')">
                <el-icon><Iphone /></el-icon>
                <span>手机号登录</span>
              </el-button>
              <el-button size="large" class="alt-btn" @click="onAltLogin('qrcode')">
                <el-icon><Picture /></el-icon>
                <span>扫码登录</span>
              </el-button>
            </div>

            <div class="divider">
              <span class="divider__line"></span>
              <span class="divider__text">其他登录方式</span>
              <span class="divider__line"></span>
            </div>

            <div class="oauth">
              <button
                v-for="item in oauthList"
                :key="item.key"
                class="oauth__btn"
                :class="`oauth__btn--${item.key}`"
                :title="`${item.name}登录`"
                :aria-label="`${item.name}登录`"
                type="button"
                @click="onOAuth(item.key)"
              >
                <!-- 各品牌 SVG icon（官方标准矢量，内联不依赖字体） -->
                <svg
                  v-if="item.key === 'wechat'"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path
                    d="M9.4 3C4.76 3 1 5.86 1 9.4c0 2.04 1.15 3.85 2.93 5.04l-.62 1.86c-.12.34.06.4.27.31.15-.07 2.25-1.48 3.15-2.09a8.7 8.7 0 0 0 2.67.42h.23A6.9 6.9 0 0 1 9.4 15.2c-3.47 0-6.28-2.56-6.28-5.8 0-3.22 2.81-5.8 6.28-5.8 3.2 0 5.84 2.17 6.23 5.02.06.34.37.58.71.58h.03c.39 0 .71-.3.69-.69A6.88 6.88 0 0 0 9.4 3ZM6.79 6.86a.98.98 0 1 1 0 1.96.98.98 0 0 1 0-1.96Zm5.22 0a.98.98 0 1 1 0 1.96.98.98 0 0 1 0-1.96Zm3.84 3.97c-3.26 0-5.9 2.35-5.9 5.26s2.64 5.26 5.9 5.26c.66 0 1.3-.1 1.9-.28l2.64 1.62c.15.1.35.05.39-.11l-.44-1.67 1.5-1.25c1.57-1.31 2.4-3.04 2.4-4.93.01-2.9-2.63-5.25-5.9-5.25h-1.59Zm-2.12 3.83a.83.83 0 1 1 0 1.66.83.83 0 0 1 0-1.66Zm4.24 0a.83.83 0 1 1 0 1.66.83.83 0 0 1 0-1.66Z"
                  />
                </svg>
                <svg
                  v-else-if="item.key === 'feishu'"
                  viewBox="0 0 48 48"
                  width="22"
                  height="22"
                  aria-hidden="true"
                >
                  <!-- Lark / 飞书 Logo（来源：@icon-park/svg 官方开源图标库，Apache-2.0 协议） -->
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M41.0716 5.99409 3.31071 16.5187l9.07489 9.2939 8.4142.1468 9.6829-9.5875c-.2561-.5244-.3842-.9635-.3842-1.3174 0-.7939.3119-1.4227.7962-1.8683 1.2442-1.1452 2.9937-1.0035 4.1604-.4588l7.1827-6.7634Zm1.0305.73433L31.5775 44.4893l-9.2939-9.0749-.1469-8.4142 9.3748-9.5186c.508.3638 1.0628.5289 1.6644.4953.9025-.0506 1.4855-.5957 1.7589-.9168a2.548 2.548 0 0 0 .567-1.649c-.0178-.7938-.4585-1.4954-1.089-1.9506.208-.1764.3884-.3827.5403-.6127Z"
                  />
                </svg>
                <svg
                  v-else-if="item.key === 'github'"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path
                    d="M12 .5C5.73.5.67 5.57.67 11.84c0 5.02 3.24 9.27 7.73 10.77.57.1.78-.25.78-.55v-1.94c-3.14.68-3.8-1.35-3.8-1.35-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.4-1.22.72-1.5-2.51-.29-5.15-1.25-5.15-5.58 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.45.11-3.02 0 0 .95-.3 3.1 1.16a10.73 10.73 0 0 1 5.64 0c2.15-1.46 3.1-1.16 3.1-1.16.61 1.57.23 2.73.11 3.02.72.79 1.16 1.8 1.16 3.03 0 4.34-2.65 5.28-5.17 5.57.41.35.77 1.04.77 2.1v3.11c0 .31.2.66.79.55a11.34 11.34 0 0 0 7.72-10.77C23.33 5.57 18.27.5 12 .5Z"
                  />
                </svg>
                <svg
                  v-else-if="item.key === 'auth0'"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  aria-hidden="true"
                >
                  <!-- Auth0 简化字母 A（粗衬线） -->
                  <text
                    x="12"
                    y="18.4"
                    text-anchor="middle"
                    font-family="'Inter', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif"
                    font-size="18"
                    font-weight="900"
                    fill="currentColor"
                    letter-spacing="-0.02em"
                  >
                    A
                  </text>
                </svg>
              </button>
            </div>

            <div class="auth-form__signup">
              还没有账号？
              <a class="link" href="javascript:;" @click="onSignUp">创建账号</a>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore, usePermissionStore, useLayoutStore } from '@/store'
import { ElMessage } from 'element-plus'
import { Check, Iphone, Lock, Moon, Picture, Platform, Sunny, User } from '@element-plus/icons-vue'
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import config from '@/config'
import { PermissionModeEnum } from '@/enum'
import { mockUsers } from '@/mocks/data/auth'
import {
  LayoutConfigHandlerEnum,
  THEME_COLOR_SWATCHES,
  useLayoutConfigHandler
} from '@/hooks/layout-config/layout-config'

const { loginSystem, loginOutSystem } = useUserStore()
const permissionStore = usePermissionStore()
const { layoutConfig } = storeToRefs(useLayoutStore())
const { setLayoutConfig } = useLayoutConfigHandler()
const router = useRouter()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const currentMode = ref<keyof typeof PermissionModeEnum>(permissionStore.getPermissionMode())

const modeOptions = [
  { value: 'ROUTE_MAPPING' as const, label: '路由 name 映射' },
  { value: 'ROLE' as const, label: '角色映射' },
  { value: 'BACKED' as const, label: '菜单映射（后端菜单）' }
]

const accountPresets = mockUsers.map(u => ({
  username: u.username,
  password: u.password,
  realName: u.realName
}))

const selectedUsername = ref<string>('admin')
const rememberAccount = ref(true)

const oauthList = [
  { key: 'wechat', name: '微信' },
  { key: 'feishu', name: '飞书' },
  { key: 'github', name: 'GitHub' },
  { key: 'auth0', name: 'Auth0' }
] as const

// ─── 颜色预设（与系统布局配置面板共享同一套） ────────────────

const swatches = THEME_COLOR_SWATCHES

const themeColor = computed(() => layoutConfig.value.themeColor)

// ★ 暗黑状态直接读 store 里的 layoutConfig.theme（不依赖 html.dark class 有没有加上）
const currentIsDark = computed(() => layoutConfig.value.theme === 'dark')

// 派生色阶：亮/暗都用同一套变量，只是在 .is-dark 下用的明暗比例不同
const derivedCssVars = computed(() => {
  const p = themeColor.value
  const dark = currentIsDark.value
  return {
    '--p': p,
    '--p-weak': withOpacity(p, dark ? 0.14 : 0.12),
    '--p-soft': withOpacity(p, dark ? 0.28 : 0.22),
    '--p-soft-2': withOpacity(p, dark ? 0.42 : 0.34),
    '--p-mid-2': withOpacity(p, dark ? 0.58 : 0.5),
    '--p-mid': withOpacity(p, dark ? 0.8 : 0.72),
    '--p-deep': withOpacity(p, dark ? 0.95 : 0.88),
    '--p-dark': shade(p, dark ? 0.08 : -0.12),
    '--p-deep-2': shade(p, dark ? 0.28 : -0.28)
  } as Record<string, string>
})

onMounted(() => {
  loginOutSystem()
})

function handleSetThemeColor(color: string) {
  setLayoutConfig(LayoutConfigHandlerEnum.THEME_COLOR, color)
}

function handleToggleDark() {
  const next = currentIsDark.value ? 'light' : 'dark'
  setLayoutConfig(LayoutConfigHandlerEnum.LAYOUT_THEME, next)
}

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

function onForgotPassword() {
  ElMessage.info('忘记密码功能待接入')
}
function onAltLogin(type: 'phone' | 'qrcode') {
  ElMessage.info(type === 'phone' ? '手机号登录待接入' : '扫码登录待接入')
}
function onOAuth(key: 'wechat' | 'feishu' | 'github' | 'auth0') {
  const name = oauthList.find(i => i.key === key)?.name ?? key
  ElMessage.info(`${name} 登录待接入`)
}
function onSignUp() {
  ElMessage.info('创建账号功能待接入')
}

// ─── 颜色工具 ────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '')
  if (h.length === 3)
    h = h
      .split('')
      .map(c => c + c)
      .join('')
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16)
  ]
}
function withOpacity(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
function clamp(v: number) {
  return Math.max(0, Math.min(255, v))
}
function shade(hex: string, amount: number): string {
  // amount>0 混白变浅；amount<0 混黑变深
  const [r, g, b] = hexToRgb(hex)
  const mix = amount >= 0 ? 255 : 0
  const w = Math.abs(amount)
  const nr = Math.round(r * (1 - w) + mix * w)
  const ng = Math.round(g * (1 - w) + mix * w)
  const nb = Math.round(b * (1 - w) + mix * w)
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0')
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`
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
$breakpoint-tablet: 880px;

// ─── 根节点 + 背景：一切样式基于 .auth-page.is-dark，不依赖 html.dark ─

.auth-page {
  position: relative;
  display: grid;
  grid-template-columns: minmax(420px, 1.1fr) minmax(420px, 1fr);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--p) 6%, #f8fafc) 0%,
    color-mix(in srgb, var(--p) 10%, #f1f5f9) 40%,
    color-mix(in srgb, var(--p) 8%, #fafafa) 100%
  );
  color: var(--el-text-color-primary, #0f172a);

  &.is-dark {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--p) 14%, #0b1220) 0%,
      color-mix(in srgb, var(--p) 8%, #0f172a) 45%,
      color-mix(in srgb, var(--p) 5%, #111827) 100%
    );
    color: #e2e8f0;
  }

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }

  .bg-blob {
    position: absolute;
    border-radius: 999px;
    filter: blur(90px);
  }
  .bg-blob--a {
    width: 520px;
    height: 520px;
    background: radial-gradient(circle at 30% 30%, var(--p-mid-2), var(--p) 55%, transparent 72%);
    top: -160px;
    left: -120px;
    opacity: 0.55;
  }
  .bg-blob--b {
    width: 560px;
    height: 560px;
    background: radial-gradient(circle at 60% 40%, var(--p-soft-2), var(--p) 55%, transparent 72%);
    bottom: -200px;
    right: 18%;
    opacity: 0.5;
  }
  .bg-blob--c {
    width: 400px;
    height: 400px;
    background: radial-gradient(
      circle at 50% 50%,
      var(--p-soft),
      var(--p-deep) 60%,
      transparent 72%
    );
    top: 30%;
    right: -120px;
    opacity: 0.32;
  }

  &.is-dark .bg-blob--a {
    background: radial-gradient(
      circle at 30% 30%,
      var(--p-soft-2),
      var(--p-deep) 60%,
      transparent 72%
    );
    opacity: 0.5;
  }
  &.is-dark .bg-blob--b {
    background: radial-gradient(
      circle at 60% 40%,
      var(--p-soft),
      var(--p-dark) 60%,
      transparent 72%
    );
    opacity: 0.46;
  }
  &.is-dark .bg-blob--c {
    background: radial-gradient(circle at 50% 50%, var(--p-weak), var(--p) 60%, transparent 72%);
    opacity: 0.3;
  }

  .bg-grain {
    position: absolute;
    inset: 0;
    opacity: 0.45;
    background-image: radial-gradient(
      circle at 1px 1px,
      rgba(255, 255, 255, 0.55) 1px,
      transparent 0
    );
    background-size: 22px 22px;
    mix-blend-mode: overlay;
  }
  &.is-dark .bg-grain {
    background-image: radial-gradient(
      circle at 1px 1px,
      rgba(255, 255, 255, 0.08) 1px,
      transparent 0
    );
  }
}

// ─── 右上角颜色预设条（玻璃胶囊） ───────────────────────────

.auth-topbar {
  position: absolute;
  top: 20px;
  right: 24px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow:
    0 10px 30px -12px rgba(15, 23, 42, 0.22),
    0 1px 0 rgba(255, 255, 255, 0.7) inset;

  .auth-page.is-dark & {
    background: rgba(15, 23, 42, 0.65);
    border: 1px solid rgba(148, 163, 184, 0.16);
    box-shadow:
      0 10px 30px -12px rgba(0, 0, 0, 0.7),
      0 1px 0 rgba(255, 255, 255, 0.05) inset;
  }
}

.color-swatches {
  display: flex;
  align-items: center;
  gap: 6px;
}

.swatch {
  --sw: #1677ff;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 0;
  background: var(--sw);
  cursor: pointer;
  padding: 0;
  position: relative;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.65),
    0 2px 6px -2px rgba(15, 23, 42, 0.25);

  &:hover {
    transform: translateY(-1px);
  }

  &.is-active {
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px var(--sw),
      0 4px 10px -2px rgba(15, 23, 42, 0.3);
    transform: translateY(0);
  }

  .auth-page.is-dark & {
    box-shadow:
      0 0 0 2px rgba(15, 23, 42, 0.7),
      0 2px 6px -2px rgba(0, 0, 0, 0.45);
  }
  .auth-page.is-dark &.is-active {
    box-shadow:
      0 0 0 2px rgba(15, 23, 42, 0.95),
      0 0 0 4px var(--sw),
      0 4px 10px -2px rgba(0, 0, 0, 0.55);
  }
}

.swatch__check {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
}

.topbar__divider {
  width: 1px;
  height: 20px;
  background: rgba(15, 23, 42, 0.12);
  .auth-page.is-dark & {
    background: rgba(148, 163, 184, 0.18);
  }
}

.icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 0;
  background: transparent;
  color: var(--el-text-color-secondary, #334155);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: var(--p-weak);
    color: var(--p-deep);
  }

  .auth-page.is-dark & {
    color: #cbd5e1;
    &:hover {
      color: var(--p-mid);
    }
  }
}

// ─── 左侧品牌区（不用插画，纯排版占位） ─────────────────────

.auth-brand {
  position: relative;
  z-index: 1;
  overflow: hidden;

  &__inner {
    height: 100%;
    padding: 44px 56px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  &__top {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__logo {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--p-deep), var(--p));
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px -6px var(--p-soft-2);
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: inherit;
    line-height: 1;
  }

  &__hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
    // max-width: 500px;
    width: 100%;
    gap: 0;
  }

  // ── 上方装饰：三条错位短竖条（左对齐） ──
  &__accent {
    display: inline-flex;
    align-items: flex-end;
    gap: 6px;
    margin-bottom: 28px;
  }
  .accent__bar {
    width: 4px;
    border-radius: 3px;
  }
  .accent__bar--primary {
    height: 40px;
    background: linear-gradient(180deg, var(--p-deep), var(--p));
    box-shadow: 0 6px 14px -6px var(--p-deep);
  }
  .accent__bar--soft {
    height: 26px;
    background: var(--p-mid);
    opacity: 0.7;
  }
  .accent__bar--faint {
    height: 16px;
    background: var(--p-soft);
    opacity: 0.6;
  }

  &__headline {
    margin: 0;
  }
  .headline__text {
    display: inline-block;
    font-size: clamp(32px, 3.4vw, 52px);
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -0.03em;
    background: linear-gradient(
      135deg,
      var(--el-text-color-primary, #0f172a) 0%,
      var(--p-deep) 60%,
      var(--p) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .auth-page.is-dark .headline__text {
    background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 45%, var(--p-mid) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  // ── 标题下装饰：短线 + 圆点 + 长线 ──
  &__divider {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin: 22px 0 24px;
  }
  .divider__line {
    height: 2px;
    border-radius: 2px;
  }
  .divider__line--short {
    width: 36px;
    background: linear-gradient(90deg, var(--p-deep), var(--p));
  }
  .divider__line--long {
    width: 72px;
    background: linear-gradient(90deg, var(--p-soft), transparent);
  }
  .divider__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--p);
    box-shadow: 0 0 0 4px var(--p-weak);
  }

  &__desc {
    font-size: 16px;
    line-height: 1.85;
    color: var(--el-text-color-secondary, #475569);
    margin: 0;
    max-width: 440px;
    letter-spacing: 0.005em;
  }
  .auth-page.is-dark &__desc {
    color: #94a3b8;
  }

  &__footer {
    font-size: 12px;
    color: var(--el-text-color-placeholder, #94a3b8);
    line-height: 1.6;
  }
  .auth-page.is-dark &__footer {
    color: #64748b;
  }
}

// ─── 品牌卡：模拟三卡片叠加的工作台 UI 预览 ──────────────

.brand-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 4 / 3;
  border-radius: 26px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.48));
  border: 1px solid rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  box-shadow:
    0 40px 90px -34px var(--p-soft-2),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  overflow: hidden;

  .auth-page.is-dark & {
    background: linear-gradient(160deg, rgba(30, 41, 59, 0.78), rgba(15, 23, 42, 0.35));
    border: 1px solid rgba(148, 163, 184, 0.18);
    box-shadow:
      0 40px 90px -34px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  // 三个柔光 blob 做背景色彩
  &__glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.45;
    pointer-events: none;
  }
  &__glow--a {
    width: 260px;
    height: 260px;
    top: -70px;
    left: -50px;
    background: radial-gradient(circle, var(--p-soft), transparent 70%);
  }
  &__glow--b {
    width: 290px;
    height: 290px;
    bottom: -80px;
    right: -60px;
    background: radial-gradient(circle, var(--p-soft-2), transparent 70%);
  }
  &__glow--c {
    width: 200px;
    height: 200px;
    top: 40%;
    left: 40%;
    background: radial-gradient(circle, color-mix(in srgb, var(--p) 40%, #fff), transparent 70%);
    opacity: 0.35;
  }
}

// ── 三个叠加的 mock 小卡片 ──
.mock-card {
  position: absolute;
  border-radius: 14px;
  box-shadow:
    0 18px 40px -18px rgba(15, 23, 42, 0.32),
    0 1px 0 rgba(255, 255, 255, 0.8) inset;
  backdrop-filter: blur(10px);
  overflow: hidden;
}
.auth-page.is-dark .mock-card {
  box-shadow:
    0 20px 45px -18px rgba(0, 0, 0, 0.7),
    0 1px 0 rgba(255, 255, 255, 0.06) inset;
}

// ── ① 浏览器窗口模拟卡（最后面，最大） ──
.mock-card--window {
  width: 68%;
  height: 62%;
  top: 8%;
  left: 8%;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.9);
}
.auth-page.is-dark .mock-card--window {
  background: rgba(30, 41, 59, 0.88);
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.window__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: rgba(248, 250, 252, 0.95);
  border-bottom: 1px solid rgba(148, 163, 184, 0.22);
}
.auth-page.is-dark .window__bar {
  background: rgba(15, 23, 42, 0.9);
  border-bottom-color: rgba(148, 163, 184, 0.18);
}

.window__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  &--r {
    background: #ff5f57;
  }
  &--y {
    background: #febc2e;
  }
  &--g {
    background: #28c840;
  }
}

.window__title {
  margin-left: 8px;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.auth-page.is-dark .window__title {
  color: #94a3b8;
}

.window__body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.window__row {
  height: 8px;
  border-radius: 4px;
  background: rgba(148, 163, 184, 0.2);
}
.auth-page.is-dark .window__row {
  background: rgba(148, 163, 184, 0.18);
}
.window__row--lg {
  width: 78%;
  height: 10px;
}
.window__row--md {
  width: 58%;
}
.window__row--sm {
  width: 40%;
}

.window__blocks {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-top: 4px;
}
.window__block {
  height: 36px;
  border-radius: 8px;
}
.window__block--1 {
  background: var(--p-weak);
}
.window__block--2 {
  background: color-mix(in srgb, var(--p) 12%, #fff);
}
.window__block--3 {
  background: var(--p-soft);
  opacity: 0.5;
}
.window__block--4 {
  background: color-mix(in srgb, var(--p) 8%, #fff);
}
.auth-page.is-dark {
  .window__block--1 {
    background: color-mix(in srgb, var(--p) 30%, rgba(15, 23, 42, 0.8));
  }
  .window__block--2 {
    background: color-mix(in srgb, var(--p) 18%, rgba(15, 23, 42, 0.8));
  }
  .window__block--3 {
    background: var(--p-soft);
    opacity: 0.35;
  }
  .window__block--4 {
    background: color-mix(in srgb, var(--p) 14%, rgba(15, 23, 42, 0.8));
  }
}

// ── ② 倾斜数据统计卡（中间） ──
.mock-card--chart {
  width: 46%;
  height: 44%;
  bottom: 16%;
  right: 8%;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.92);
  transform: rotate(-7deg);
  padding: 12px 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.auth-page.is-dark .mock-card--chart {
  background: rgba(30, 41, 59, 0.94);
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.chart__head {
  display: flex;
  align-items: center;
  gap: 6px;
}
.chart__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--p-deep), var(--p));
  box-shadow: 0 0 0 3px var(--p-weak);
  flex-shrink: 0;
}
.chart__label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  flex: 1;
}
.auth-page.is-dark .chart__label {
  color: #94a3b8;
}

.chart__value {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--p-deep);
}
.auth-page.is-dark .chart__value {
  color: var(--p-mid);
}

.chart__bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  flex: 1;
  min-height: 0;
}
.chart__bar {
  flex: 1;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(180deg, var(--p-mid-2), var(--p-deep));
  opacity: 0.88;
  min-height: 8px;
}
.auth-page.is-dark .chart__bar {
  background: linear-gradient(180deg, var(--p-mid), var(--p-deep-2));
}

// ── ③ 通知徽章卡（最前面，右下） ──
.mock-card--badge {
  width: 50%;
  bottom: 6%;
  left: 10%;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.94);
  padding: 10px 12px;
  transform: rotate(3deg);
  display: flex;
  align-items: center;
  gap: 10px;
}
.auth-page.is-dark .mock-card--badge {
  background: rgba(30, 41, 59, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.mb__icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 14px -8px #06b6d4;
  svg {
    width: 16px;
    height: 16px;
  }
}

.mb__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.mb__title {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--el-text-color-primary, #0f172a);
  line-height: 1.3;
}
.mb__sub {
  font-size: 11px;
  color: var(--el-text-color-secondary, #475569);
  line-height: 1.4;
}
.auth-page.is-dark {
  .mb__title {
    color: #f1f5f9;
  }
  .mb__sub {
    color: #94a3b8;
  }
}

// ─── 右侧表单：玻璃态面板 ───────────────────────────────────

.auth-form {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  &__sheet {
    width: 100%;
    max-width: 480px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(22px) saturate(150%);
    -webkit-backdrop-filter: blur(22px) saturate(150%);
    box-shadow:
      0 30px 60px -20px rgba(15, 23, 42, 0.22),
      0 1px 0 rgba(255, 255, 255, 0.8) inset;
    position: relative;
    overflow: hidden;

    .auth-page.is-dark & {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(148, 163, 184, 0.18);
      box-shadow:
        0 30px 70px -20px rgba(0, 0, 0, 0.72),
        0 1px 0 rgba(255, 255, 255, 0.05) inset;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--p) 50%, transparent 100%);
      opacity: 0.75;
    }
  }

  &__inner {
    padding: 44px 40px;
    box-sizing: border-box;
  }

  &__header {
    margin-bottom: 28px;
  }

  &__heading {
    font-size: 26px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: var(--el-text-color-primary, #0f172a);
    margin: 0 0 8px;
  }

  .auth-page.is-dark &__heading {
    color: #f1f5f9;
  }

  &__subheading {
    font-size: 14px;
    line-height: 1.5;
    color: var(--el-text-color-secondary, #475569);
    margin: 0;
  }

  .auth-page.is-dark &__subheading {
    color: #94a3b8;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  &__submit {
    width: 100%;
    margin-top: 6px;
    font-weight: 500;
    border-radius: 10px;
    height: 44px;
    box-shadow:
      0 1px 2px var(--p-soft),
      0 8px 20px -6px var(--p-soft-2);
    transition:
      transform 0.15s ease,
      filter 0.15s ease,
      box-shadow 0.15s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow:
        0 2px 4px var(--p-soft-2),
        0 14px 28px -8px var(--p-mid-2);
    }

    &:active {
      transform: translateY(0);
      filter: brightness(0.95);
    }
  }

  // 记住账号 / 忘记密码 一行
  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
    gap: 12px;
  }

  // 手机号 / 扫码 两个次按钮
  &__alt-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 2px;

    :deep(.alt-btn) {
      height: 42px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 500;
      border: 1px solid var(--el-border-color);
      background: var(--el-bg-color-overlay, #fff);
      color: var(--el-text-color-primary);
      transition:
        transform 0.15s ease,
        box-shadow 0.15s ease,
        border-color 0.15s ease;

      &:hover {
        transform: translateY(-1px);
        border-color: var(--el-color-primary, var(--p));
        box-shadow: 0 4px 12px -6px var(--p-soft-2);
      }
    }
  }

  .auth-page.is-dark &__alt-buttons :deep(.alt-btn) {
    background: rgba(15, 23, 42, 0.6);
    border-color: rgba(148, 163, 184, 0.2);
    color: #e2e8f0;
  }

  // 底部创建账号
  &__signup {
    text-align: center;
    font-size: 13px;
    color: var(--el-text-color-secondary, #475569);
    line-height: 1.6;
  }
  .auth-page.is-dark &__signup {
    color: #94a3b8;
  }
}

// ─── 记住账号 checkbox / 链接 ───────────────────────────────

.remember {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary, #475569);
  cursor: pointer;
  user-select: none;

  .auth-page.is-dark & {
    color: #cbd5e1;
  }

  :deep(.el-checkbox) {
    margin-right: 0;
  }
}

.link {
  font-size: 13px;
  color: var(--el-color-primary, var(--p-deep));
  text-decoration: none;
  transition: opacity 0.15s ease;
  &:hover {
    opacity: 0.8;
  }
}

// ─── 「其他登录方式」分割线 ────────────────────────────────

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 0;

  &__line {
    flex: 1;
    height: 1px;
    background: var(--el-border-color-lighter);
  }
  .auth-page.is-dark &__line {
    background: rgba(148, 163, 184, 0.18);
  }

  &__text {
    font-size: 12px;
    color: var(--el-text-color-secondary, #64748b);
    line-height: 1;
  }
  .auth-page.is-dark &__text {
    color: #94a3b8;
  }
}

// ─── 第三方 OAuth 按钮组 ────────────────────────────────────

.oauth {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;

  &__btn {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    border: 1px solid var(--el-border-color);
    background: var(--el-bg-color-overlay, #fff);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-primary);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease,
      background-color 0.15s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px -6px var(--p-soft-2);
      border-color: var(--el-color-primary, var(--p));
    }

    // 各品牌专属色 hover
    &--wechat:hover {
      color: #07c160;
      border-color: #07c160;
    }
    &--feishu:hover {
      color: #3370ff;
      border-color: #3370ff;
    }
    &--github:hover {
      color: #24292f;
      border-color: #24292f;
    }
    &--auth0:hover {
      color: #eb5424;
      border-color: #eb5424;
    }

    .auth-page.is-dark & {
      background: rgba(15, 23, 42, 0.6);
      border-color: rgba(148, 163, 184, 0.22);
      color: #cbd5e1;

      &--github:hover {
        color: #fff;
        border-color: #fff;
      }
    }
  }
}

// ─── 字段：小 label + focus 光环 ────────────────────────────

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__label {
    font-size: 12px;
    font-weight: 500;
    color: var(--el-text-color-secondary, #475569);
    line-height: 1;
  }

  .auth-page.is-dark &__label {
    color: #94a3b8;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    border-radius: 10px;
    background: var(--el-bg-color-overlay, #fff);
    box-shadow: 0 0 0 1px var(--el-border-color) inset;
    transition:
      box-shadow 0.15s ease,
      background-color 0.15s ease;
  }

  :deep(.el-input.is-focus .el-input__wrapper),
  :deep(.el-select.is-focused .el-select__wrapper) {
    box-shadow:
      0 0 0 1px var(--p) inset,
      0 0 0 3px var(--p-weak);
  }

  .auth-page.is-dark & {
    :deep(.el-input__wrapper),
    :deep(.el-select__wrapper) {
      background: rgba(15, 23, 42, 0.7);
      box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.2) inset;
    }
  }
}

// ─── 响应式 ─────────────────────────────────────────────────

@media (max-width: $breakpoint-tablet) {
  .auth-page {
    grid-template-columns: 1fr;
  }

  .auth-brand {
    display: none;
  }

  .auth-form__inner {
    padding: 32px 24px;
  }

  .auth-topbar {
    top: 14px;
    right: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .auth-form__submit,
  .swatch {
    transition: none;
    &:hover {
      transform: none;
    }
  }
  .field :deep(.el-input__wrapper),
  .field :deep(.el-select__wrapper) {
    transition: none;
  }
}
</style>
