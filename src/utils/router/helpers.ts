/*
 * @Description: 助手方法
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 16:01:22
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 22:35:30
 * @FilePath: \vite-admin-vue\src\utils\router\helpers.ts
 */

type RouteType = VRouter.DefineRoutes
type RFiles = Record<
  string,
  {
    [key: string]: any
    default: VRouter.DefineRoutes[]
  }
>

/**
 *
 * @param files 文件夹路径
 * @returns
 */
export const loadRoutes = (files: RFiles): RouteType[] => {
  return Object.keys(files).reduce((arr: RouteType[], key: string): RouteType[] => {
    const routes: RouteType[] = files[key].default
    arr.push(...routes)
    return arr
  }, [])
}

/**
 *  默认暴露类型检测
 * @param routes
 * @returns
 */
export function defineExposeRoutes(routes: VRouter.DefineRoutes[]): VRouter.DefineRoutes[] {
  return routes
}
