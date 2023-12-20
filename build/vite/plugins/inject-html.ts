import { createHtmlPlugin } from 'vite-plugin-html'

export function injectHtmlPlugin({ env }) {
  console.log('env', env)

  return createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        VITE_APP_TITLE: env.VITE_APP_TITLE,
        VITE_APP_DESC: env.VITE_APP_VITE_APP_DESC
      }
    }
  })
}
