/*
 * @Description:
 * @Autor: qsyj
 * @Date: 2022-08-04 15:08:51
 * @LastEditors: qsyj
 * @LastEditTime: 2022-08-04 15:43:36
 */

import { resolve } from 'path'

/** 项目根目录 */
export const projectRootPath = process?.cwd() || resolve(__dirname, '..', '..')

/** 环境变量目录 */
export const envDir = resolve(projectRootPath, 'env')
