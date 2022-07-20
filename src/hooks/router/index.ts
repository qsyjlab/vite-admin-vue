/*
 * @Description: router hooks
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 13:35:50
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 11:36:04
 * @FilePath: \vite-admin-vue\src\hooks\router\index.ts
 */

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
