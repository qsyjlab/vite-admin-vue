import { clearCache } from '@/store/local'
import { getUrlParam } from '@/utils'
import { ssoLogin } from '@/api/user'
import { useUserStoreOut } from '@/store'
import config from '@/config'

export async function sso() {
  const ticket = getUrlParam('ticket')

  await new Promise(resolve => {
    if (!config.enableSSO) {
      resolve({})
      return
    }
    if (ticket) {
      const { loginAfterInitialize } = useUserStoreOut()
      ssoLogin({ ticket })
        .then(res => {
          if (!res.data) return

          loginAfterInitialize(res.data)
          resolve({})
        })
        .catch(() => {
          window.location.href = config.casBaseUrl
        })
    } else {
      resolve({})
    }
  })
}

export function ssoLoginOut() {
  clearCache()
  // 重定向到 sso 登录地址中, 如果携带参数自行处理
  window.location.href = config.casBaseUrl
}
