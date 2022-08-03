/*
 * @Description: globa config
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 11:33:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-08-03 16:16:44
 * @FilePath: \vite-admin-vue\src\config\index.ts
 */

import { readonly } from '@/utils'

import { ReadOnlyConfig } from './types'

const VITE_EVN = import.meta.env

export const url = {
  baseUrl: {
    system: VITE_EVN.VITE_APP_API_BASE_URL
  },
  fileUrl: {
    file: VITE_EVN.VITE_APP_FILE_URL
  }
}

const config = readonly<ReadOnlyConfig>({
  storage: {
    prefix: VITE_EVN.VITE_APP_LOCALSTORAGE_PREFIX,
    expires: VITE_EVN.VITE_APP_LOCALSTORAGE_EXPIRES
  },
  axios: {
    headers: {
      Authorization: VITE_EVN.VITE_APP_AXIOS_HEADERS_AUTHRIZATION
    }
  },
  url
})

console.log('config', config)

export { config as default }
