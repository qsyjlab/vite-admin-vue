/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2021-12-29 10:59:47
 * @LastEditors: qsyj
 * @LastEditTime: 2022-01-06 17:34:25
 */
export interface moudleType {
  [key: string | number]: any
}

export interface appRootState {
  keepAliveList: any[]
  layoutConfig: {
    isCollapse: boolean
    // isShowSetting: boolean
    themeColor: string
    // keepAliveList: any[]
  }
}
