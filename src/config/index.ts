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

const config = {
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
}

export { config as default, config }
