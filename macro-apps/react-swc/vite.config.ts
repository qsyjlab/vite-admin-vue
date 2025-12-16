import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import qiankun from 'vite-plugin-qiankun'

// https://vite.dev/config/
export default defineConfig({
  plugins: [qiankun('react-swc', { useDevMode: true })],
  server: {
    origin: 'http://localhost:5301',
    port: 5301,
    cors: true
  }
})
