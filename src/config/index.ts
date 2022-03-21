/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 11:33:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-21 15:02:19
 * @FilePath: \vite-admin-vue\src\config\index.ts
 */

import { isReadonly } from '@/utils'

import { StorageKeys } from '@/enum'

interface readOnlyConfig {
  readonly storage: {
    prefix: StorageKeys.Prefix
    expires: StorageKeys.Expires
  }
  readonly axios: {
    headers: {
      Authrization: {
        position: string
        value: string
        key: string
      }
    }
  }
}

const config = isReadonly<readOnlyConfig>({
  storage: {
    prefix: StorageKeys.Prefix,
    expires: StorageKeys.Expires
  },
  axios: {
    headers: {
      /**
       * auth验证
       * @description
       */
      Authrization: {
        position: 'headers',
        value: 'Bearer Auth',
        key: 'Authorization'
      }
    }
  }
})

export { config as default }
