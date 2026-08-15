import type { AxiosRequestConfig } from 'axios'

// 用于存储每个请求的标识和取消函数
const pendingMap = new Map<string, AbortController>()
const requestControllers = new WeakMap<AxiosRequestConfig, AbortController>()

const getPendingUrl = (config: AxiosRequestConfig): string => {
  return [config.method, config.url].join('&')
}

export class AxiosCanceler {
  /**
   * 添加请求
   * @param config 请求配置
   */
  public addPending(config: AxiosRequestConfig): void {
    const url = getPendingUrl(config)
    pendingMap.get(url)?.abort(url)
    pendingMap.delete(url)

    const controller = new AbortController()
    config.signal = config.signal || controller.signal
    pendingMap.set(url, controller)
    requestControllers.set(config, controller)
  }

  /**
   * 清除所有等待中的请求
   */
  public removeAllPending(): void {
    pendingMap.forEach(abortController => {
      if (abortController) {
        abortController.abort()
      }
    })
    this.reset()
  }

  /**
   * 移除请求
   * @param config 请求配置
   */
  public removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config)
    const controller = requestControllers.get(config)

    // A finished older request must not abort or remove the newer request with the same URL.
    if (controller && pendingMap.get(url) === controller) {
      pendingMap.delete(url)
    }
    requestControllers.delete(config)
  }

  /**
   * 重置
   */
  public reset(): void {
    pendingMap.clear()
  }
}
