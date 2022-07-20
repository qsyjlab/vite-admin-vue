/*
 * @Description:
 * @Autor: qsyj
 * @Date: 2022-07-20 15:40:44
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 15:59:38
 */

import type { App } from 'vue'

type defineAppPlugin = (install: (app: App) => void) => (app: App) => void

/**
 * 类型包装器
 * @param install
 * @returns
 */
export const defineAppPlugin: defineAppPlugin = install => install
