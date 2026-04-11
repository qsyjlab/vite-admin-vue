import type { ProxyOptions } from 'vite'

type ProxyTargetList = Record<string, ProxyOptions>

const httpsRE = /^https:\/\//

function normalizeProxyPrefix(prefix: string) {
  const normalized = String(prefix || '').trim()

  // `/` 会吞掉 Vite 静态资源和 HMR 请求，这里直接禁用。
  if (!normalized || normalized === '/' || normalized === '/*') {
    return null
  }

  if (!normalized.startsWith('/')) {
    return `/${normalized}`
  }

  return normalized
}

export function createProxy(envString: string) {
  const list = JSON.parse(envString.replace(/'/g, '"'))
  const ret: ProxyTargetList = {}
  for (const item of list) {
    const [rawPrefix, target, rewrite = ''] = item
    const prefix = normalizeProxyPrefix(rawPrefix)

    if (!prefix) {
      console.warn(
        `[vite:proxy] skip invalid proxy prefix "${String(
          rawPrefix
        )}", avoid proxying all Vite requests`
      )
      continue
    }

    const isHttps = httpsRE.test(target)
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: path => {
        return path.replace(new RegExp(`^${prefix}`), rewrite)
      },
      configure: (proxy, options) => {
        ;(proxy as any).on('proxyReq', (proxyReq, req) => {
          console.log(
            `\n\x1b[34m[vite:proxy]\x1b[0m ${prefix}  proxying request from \x1b[32m${
              proxyReq.path
            }\x1b[0m to \x1b[32m${options?.target || '' + req?.url || ''}\x1b[0m`
          )
        })
      },
      ...(isHttps ? { secure: false } : {})
    }
  }
  return ret
}
