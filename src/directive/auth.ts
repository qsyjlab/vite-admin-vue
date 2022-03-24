/*
 * @Description: 鉴权指令
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-21 16:15:34
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-24 22:02:05
 * @FilePath: \vite-admin-vue\src\directive\auth.ts
 */

import type { Directive } from 'vue'
import store from '@/store'

/**
 * 是否有权限
 */
export const hasAuthDirective: Directive<HTMLElement, string> = {
  // 指令绑定元素挂载后
  mounted(el, binding) {
    if (!store.state.user.permissions.includes(binding.value)) el.parentNode?.removeChild(el)
  }
}

/**
 * 是否角色
 */
export const hasRoleDirective: Directive<HTMLElement, string> = {
  // 指令绑定元素挂载后
  mounted(el, binding) {
    if (!(store.state.user.userInfo.userRole === binding.value)) el.parentNode?.removeChild(el)
  }
}
