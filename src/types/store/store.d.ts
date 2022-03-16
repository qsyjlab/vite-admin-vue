/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 22:57:39
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-16 17:55:12
 * @FilePath: \vite-admin-vue\src\types\store\store.d.ts
 */
declare namespace VStoreRoot {
  type rootState = Record<string, never>

  type mapState<T> = {
    [P in keyof T]: import('vue').ComputedRef<T[P]>
  }

  type rootMoudles = {
    [key: string]: import('vuex').StoreOptions<rootState>
  }

  namespace app {
    export type appRootState = import('./moudles/app').appRootStateType

    export type appStateHepler = import('./moudles/app').appStateHepler

    export type appMutations = import('./moudles/app').appMutations
  }

  namespace route {
    export type routeRootState = import('./moudles/route').appRootStateType
  }
}
