/*
 * @Description:
 * @Autor: qsyj
 * @Date: 2022-07-20 15:40:44
 * @LastEditors: qsyj
 * @LastEditTime: 2022-08-02 13:44:53
 */

import type { App } from 'vue'

type DefineAppPlugin = (install: (app: App) => void) => (app: App) => void

/**
 * 类型包装器
 * @param install
 * @returns
 */
export const defineAppPlugin: DefineAppPlugin = install => install
