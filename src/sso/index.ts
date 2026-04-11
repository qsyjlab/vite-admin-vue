import { clearCache } from '@/store/local'
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
  clearCache()
  // 重定向到 sso 登录地址中, 如果携带参数自行处理
  window.location.href = config.casBaseUrl
}
