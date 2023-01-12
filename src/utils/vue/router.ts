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
