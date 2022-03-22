/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 22:57:39
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 21:49:13
 * @FilePath: \vite-admin-vue\src\types\store\store.d.ts
 */
declare namespace VStoreRoot {
  type RootState = {
    route: route.RouteRootState
    app: app.AppRootState
    user: user.UserRootState
  }

  type MapState<T> = {
    [P in keyof T]: import('vue').ComputedRef<T[P]>
  }

  type RootMoudles = {
    [key: string]: import('vuex').StoreOptions<RootState>
  }

  namespace app {
    export type AppRootState = import('./moudles/app').AppRootStateType

    export type AppStateHepler = import('./moudles/app').AppStateHepler

    export type AppMutations = import('./moudles/app').AppMutations
  }

  namespace route {
    export type RouteRootState = import('./moudles/route').RouteRootStateType
  }

  namespace user {
    export type UserRootState = import('./moudles/user').userRootStateType

    export type UserActions = import('./moudles/user').userActions
  }
}
