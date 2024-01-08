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
      ...(isHttps ? { secure: false } : {})
    }
  }

  console.log('ret', ret)

  return ret
}
