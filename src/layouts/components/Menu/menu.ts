/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-15 21:48:13
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-15 22:01:25
 * @FilePath: \vite-admin-vue\src\layouts\components\Menu\menu.ts
 */

export interface MenuItem {
  title: string
  name: string
  children?: MenuItem
}
