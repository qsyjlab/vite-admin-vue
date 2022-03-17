/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 11:33:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-17 14:50:48
 * @FilePath: \vite-admin-vue\src\config\index.ts
 */

import { isReadonly } from '@/utils'

interface readOnlyConfig {
  storage: {
    prefix: string
    expires: number
  }
  axios: {
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
    prefix: 'basic_',
    expires: 7 * 24 * 3600
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
