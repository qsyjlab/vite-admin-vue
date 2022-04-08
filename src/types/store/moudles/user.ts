/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 14:43:13
 * @LastEditors: qsyj
 * @LastEditTime: 2022-04-03 22:37:53
 * @FilePath: \vite-admin-vue\src\types\store\moudles\user.ts
 */

export interface UserRootStateType {
  userInfo: Auth.UserInfo
  permissions: string[]
}

export interface UserActions {
  loginSystem: (data: { username: string | undefined; password: string | undefined }) => void
  loginOutSystem: () => void
}
