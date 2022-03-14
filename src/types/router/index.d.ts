/*
 * @Description: vue-router.d.ts entry
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 15:21:37
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 22:21:36
 * @FilePath: \vite-admin-vue\src\types\router\index.d.ts
 */

import 'vue-router'

///// <reference types="vue-router"/>

// interface RouteMeta extends VRouter.RouteMeta {
//     title?: string
// }

// interface RouteRecordRaw {
//     redirect?: import('vue-router').RouteRecordRedirectOption
// }

//         title?: string
//     }

declare module 'vue-router' {
    // type RouteRecordRaw  = VRouter.

    // export interface RouteRecordRaw

    export interface RouteMeta extends VRouter.RouteMeta {
        title?: string
    }
}
