import { defineConfig } from './types'

const VITE_EVN = import.meta.env

export default defineConfig({
  publicBaseUrl: import.meta.env.BASE_URL,
  baseApiUrl: VITE_EVN.VITE_APP_API_BASE_URL,
  casBaseUrl: VITE_EVN.VITE_CAS_BASE_URL,
  projectTitle: VITE_EVN.VITE_APP_TITLE,
  projectDesc: VITE_EVN.VITE_APP_DESC,
  enableSSO: VITE_EVN.VITE_ENABLE_SSO,
  storage: {
    prefix: '_BASIC_'
  }
})
