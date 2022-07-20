/*
 * @Description:
 * @Autor: qsyj
 * @Date: 2022-07-20 14:39:04
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 14:43:41
 */

import type { InjectionKey } from 'vue'

/**
 * TODO: globalContextInjectionKey: InjectionKey<any> 需要类型自行补全
 */
export const globalContextInjectionKey: InjectionKey<any> = Symbol('globalContextInjectionKey')
