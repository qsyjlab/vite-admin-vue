/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 22:57:39
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-11 23:28:03
 * @FilePath: \vite-admin-vue\src\types\store.d.ts
 */

/// <reference types="vuex" />



export declare namespace VStoreRoot {

  type rootState = {}

  type rootMoudles<S> = {
    [key:string]:S
  }
}
