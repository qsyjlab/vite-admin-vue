import { createHtmlPlugin } from 'vite-plugin-html'

export function injectHtmlPlugin(options: { env: any }) {
  const { env } = options || {}
  return createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        BASE_URL: env.BASE_URL,
        VITE_APP_TITLE: env.VITE_APP_TITLE,
        VITE_APP_DESC: env.VITE_APP_VITE_APP_DESC
      }
    }
  })
}
