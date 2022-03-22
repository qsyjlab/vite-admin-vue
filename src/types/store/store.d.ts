/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 22:57:39
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 21:52:40
 * @FilePath: \vite-admin-vue\src\types\store\store.d.ts
 */
declare namespace VStoreRoot {
  type RootState = {
    route: Route.RouteRootState
    app: App.AppRootState
    user: User.UserRootState
  }

  type MapState<T> = {
    [P in keyof T]: import('vue').ComputedRef<T[P]>
  }

  type RootMoudles = {
    [key: string]: import('vuex').StoreOptions<RootState>
  }

  namespace App {
    export type AppRootState = import('./moudles/app').AppRootStateType

    export type AppStateHepler = import('./moudles/app').AppStateHepler

    export type AppMutations = import('./moudles/app').AppMutations
  }

  namespace Route {
    export type RouteRootState = import('./moudles/route').RouteRootStateType
  }

  namespace User {
    export type UserRootState = import('./moudles/user').UserRootStateType

    export type UserActions = import('./moudles/user').UserActions
  }
}
