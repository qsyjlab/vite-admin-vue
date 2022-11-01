import { useUserStore } from '@/store'
import type { Directive } from 'vue'

/**
 * 是否有权限
 */
export const hasAuthDirective: Directive<HTMLElement, string> = {
  // 指令绑定元素挂载后
  mounted(el, binding) {
    const userStore = useUserStore()
    if (!userStore.permissions.includes(binding.value)) el.parentNode?.removeChild(el)
  }
}

/**
 * 是否角色
 */
export const hasRoleDirective: Directive<HTMLElement, string> = {
  // 指令绑定元素挂载后
  mounted(el, binding) {
    const userStore = useUserStore()
    if (!(userStore.userInfo.userRole === binding.value)) el.parentNode?.removeChild(el)
  }
}
