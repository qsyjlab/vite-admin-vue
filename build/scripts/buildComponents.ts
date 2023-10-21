const { resolve } = require('path')
const { build } = require('vite')

const vue = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')
const projectRootPath = process?.cwd() || resolve(__dirname, '..', '..')

async function buildComponents() {
  await build({
    configFile: false,
    envFile: false,
    root: resolve(projectRootPath),

    build: {
      copyPublicDir: false,
      outDir: resolve(projectRootPath, 'docs', '.vitepress', '.exampleCompnents'),
      lib: {
        entry: resolve(projectRootPath, 'src', 'components'),
        formats: ['es'],
        fileName: 'index'
      },
      rollupOptions: {
        // 配置 external
        external: ['vue', '@element-plus/icons-vue', 'element-plus']
      }
    },

    plugins: [vue(), vueJsx()],

    resolve: {
      alias: {
        '@': resolve(projectRootPath, 'src'),
        '~': projectRootPath
      }
    }
  })
}

buildComponents()
