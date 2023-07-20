import { defineConfig } from './types'

const VITE_EVN = import.meta.env

export default defineConfig({
  baseApiUrl: VITE_EVN.BASE_URL
})
