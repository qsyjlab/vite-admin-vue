/*
 * @Description: route root types
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 22:46:48
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-15 23:00:45
 * @FilePath: \vite-admin-vue\src\types\store\moudles\route.ts
 */

export interface appRootStateType {
  menuList: VRouter.DefineRoutes[] | never[]
  isFristEntry: boolean
}
