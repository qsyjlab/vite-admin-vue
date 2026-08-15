import { clearUserCache } from '@/store/local'
import { getUrlParam } from '@/utils'
import { ssoLogin } from '@/api/user'
import { useUserStoreOut } from '@/store'
import config from '@/config'

export async function sso() {
  const ticket = getUrlParam('ticket')

  if (!config.enableSSO || !ticket) {
    return
  }

  const { loginAfterInitialize } = useUserStoreOut()

  try {
    const res = await ssoLogin({ ticket })
    if (!res.data) return
    await loginAfterInitialize(res.data)
  } catch {
    window.location.href = config.casBaseUrl
  }
}

export function ssoLoginOut() {
  // SSO 登出仅清除用户/权限缓存，保留布局与暗黑模式等全局偏好
  clearUserCache()
  // 重定向到 sso 登录地址中, 如果携带参数自行处理
  window.location.href = config.casBaseUrl
}
