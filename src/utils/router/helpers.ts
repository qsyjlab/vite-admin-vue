/*
 * @Description: 助手方法
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 16:01:22
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 16:59:59
 * @FilePath: \vite-admin-vue\src\utils\router\helpers.ts
 */

import { RouteRecordRaw } from 'vue-router'

type RFiles = Record<
  string,
  {
    [key: string]: any
    default: RouteRecordRaw[]
  }
>

/**
 *
 * @param {String} files 文件夹路径
 * @returns { RouteType }
 */
export const loadRoutes = (files: RFiles): RouteRecordRaw[] => {
  return Object.keys(files).reduce((arr: RouteRecordRaw[], key: string): RouteRecordRaw[] => {
    const routes: RouteRecordRaw[] = files[key].default
    arr.push(...routes)
    return arr
  }, [])
}

export function defineExposeRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes
}
