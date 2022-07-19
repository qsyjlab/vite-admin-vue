/*
 * @Description: 鉴权指令
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 16:15:34
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 16:11:21
 * @FilePath: \vite-admin-vue\src\directive\auth.ts
 */

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
