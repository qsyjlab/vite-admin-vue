/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 14:43:13
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 21:52:21
 * @FilePath: \vite-admin-vue\src\types\store\moudles\user.ts
 */

export interface UserRootStateType {
  userInfo: Auth.UserInfo
  permissions: string[]
}

export interface UserActions {
  loginSystem: (data: { username: string; password: string }) => void
  loginOutSystem: () => void
}
