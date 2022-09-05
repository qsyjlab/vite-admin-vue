import { useRouter } from 'vue-router'

export const useRouterHelper = () => {
  const router = useRouter()

  /**
   * 登录后跳转
   */
  const loginAfterTo = () => {
    router.push({ name: 'Home' })
  }

  return {
    loginAfterTo
  }
}
