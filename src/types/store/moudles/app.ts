/*
 * @Description: app 全局声明类型
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-12 17:01:17
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 17:55:39
 * @FilePath: \vite-admin-vue\src\types\store\moudles\app.ts
 */

export interface keepAliveListType {
  [key: string | number]: {
    [key: string | number]: string[]
  }
}

export interface appRootStateType {
  keepAliveList: keepAliveListType
  layoutConfig: {
    // 是否折叠 菜单栏
    isCollapse: boolean
    themeColor: string
  }
}

export interface appMutations {
  collapseMenu: () => void
}

export type appStateHepler = VStoreRoot.mapState<appRootStateType>
