import { defineConfig } from './types'

const VITE_EVN = import.meta.env

export default defineConfig({
  baseApiUrl: VITE_EVN.VITE_APP_API_BASE_URL,
  projectTitle: VITE_EVN.VITE_APP_TITLE,
  projectDesc: VITE_EVN.VITE_APP_DESC,
  storagePrefix: '_BASIC_'
})
