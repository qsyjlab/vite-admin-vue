/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-20 20:28:07
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-20 20:44:34
 * @FilePath: \vite-admin-vue\src\components\common\components.d.ts
 */

declare module 'vue' {
  export interface GlobalComponents {
    QsForm: typeof import('./index')['Form']
  }
}

export {}
