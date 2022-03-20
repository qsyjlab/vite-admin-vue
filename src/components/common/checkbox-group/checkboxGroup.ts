/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-20 22:33:40
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-20 22:33:41
 * @FilePath: \vite-admin-vue\src\components\common\checkbox-group\checkboxGroup.ts
 */

export interface OptionsType {
  label: string | number
  value: any
  key: string | number
  attrs?: {
    [propName: string]: any
  }
}
