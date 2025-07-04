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
    optimizeDeps: {
      exclude: ['../../src/components/tinymce/**', 'vue', '@vue-office/pdf', '@vue-office/excel']
    },

    build: {
      copyPublicDir: false,

      outDir: resolve(projectRootPath, 'docs', '.vitepress', '.exampleCompnents'),
      lib: {
        entry: resolve(projectRootPath, 'src', 'components'),
        formats: ['es'],
        fileName: 'index'
      },
      /**
       * @see https://github.com/vitejs/vite/issues/13233
       */
      commonjsOptions: {
        esmExternals: ['vue']
      },
      rollupOptions: {
        // 配置 external
        external: ['vue', '@element-plus/icons-vue', 'element-plus']
      },
      output: [
        {
          format: 'es',
          //不用打包成.es.js,这里我们想把它打包成.js
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          //配置打包根目录
          dir: 'es'
          // preserveModulesRoot: 'src'
        }
      ]
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
