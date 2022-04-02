/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 11:33:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-04-02 23:12:09
 * @FilePath: \vite-admin-vue\src\config\index.ts
 */

import { isReadonly } from '@/utils'

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

const config = isReadonly<ReadOnlyConfig>({
  storage: {
    prefix: VITE_EVN.VITE_APP_LOCALSTORAGE_PREFIX,
    expires: VITE_EVN.VITE_APP_LOCALSTORAGE_EXPIRES
  },
  axios: {
    headers: {
      Authrization: VITE_EVN.VITE_APP_AXIOS_HEADERS_AUTHRIZATION
    }
  },
  url
})

export { config as default }
