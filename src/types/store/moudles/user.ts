/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-18 14:43:13
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-18 15:17:43
 * @FilePath: \vite-admin-vue\src\types\store\moudles\user.ts
 */

export interface userRootStateType {
  userInfo: Auth.UserInfo
}

export interface userActions {
  loginSystem: (data: { username: string; password: string }) => void
  loginOutSystem: () => void
}
