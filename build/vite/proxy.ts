import type { ProxyOptions } from 'vite'

type ProxyTargetList = Record<string, ProxyOptions>

const httpsRE = /^https:\/\//

export function createProxy(envString: string) {
  const list = JSON.parse(envString.replace(/'/g, '"'))
  const ret: ProxyTargetList = {}
  for (const item of list) {
    const [prefix, target, rewrite = ''] = item
    const isHttps = httpsRE.test(target)
    ret[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: path => {
        return path.replace(new RegExp(`^${prefix}`), rewrite)
      },
      configure: (proxy, options) => {
        proxy.on('proxyReq', (proxyReq, req) => {
          console.log(
            `\n\x1b[34m[vite:proxy]\x1b[0m ${prefix}  proxying request from \x1b[32m${
              proxyReq.path
            }\x1b[0m to \x1b[32m${options.target + req.url}\x1b[0m`
          )
        })
      },
      ...(isHttps ? { secure: false } : {})
    }
  }
  return ret
}
