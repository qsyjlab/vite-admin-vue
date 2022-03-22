/*
 * @Description: app 全局声明类型
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-12 17:01:17
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 21:49:15
 * @FilePath: \vite-admin-vue\src\types\store\moudles\app.ts
 */

export interface AppRootStateType {
  isOpenSettig: boolean
  layoutConfig: {
    // 是否折叠 菜单栏
    isCollapse: boolean

    themeColor: string
  }
}

export interface AppMutations {
  collapseMenu: () => void
  toggleSettingDrawer: () => void
}

export type AppStateHepler = VStoreRoot.MapState<AppRootStateType>
