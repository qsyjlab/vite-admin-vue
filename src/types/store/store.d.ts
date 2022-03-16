/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 22:57:39
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-15 22:51:06
 * @FilePath: \vite-admin-vue\src\types\store\store.d.ts
 */
declare namespace VStoreRoot {
  type rootState = Record<string, never>

  type rootMoudles = {
    [key: string]: import('vuex').StoreOptions<rootState>
  }

  namespace app {
    export type appRootState = import('./moudles/app').appRootStateType
  }

  namespace route {
    export type routeRootState = import('./moudles/route').appRootStateType
  }
}
