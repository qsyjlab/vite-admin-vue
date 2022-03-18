/*
 * @Description: 用户信息
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 14:30:12
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-18 14:31:29
 * @FilePath: \vite-admin-vue\src\types\Auth\auth.d.ts
 */
declare namespace Auth {
  interface UserInfo {
    userId: string | number
    userName: string
    userRole: string
  }
}
