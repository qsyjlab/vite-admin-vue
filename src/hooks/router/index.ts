import { computed } from 'vue'
import { useRouter } from 'vue-router'

export const useRouterHelper = () => {
  const router = useRouter()

  const currentRoute = router.currentRoute

  // 取出是 unref 加computed 以 保持 反应
  const currentModule = computed(() => currentRoute.value.matched[0])
  /**
   * 登录后跳转
   */
  const loginAfterTo = () => {
    router.push({ name: 'Home' })
  }

  return {
    currentRoute,
    currentModule,
    loginAfterTo
  }
}
