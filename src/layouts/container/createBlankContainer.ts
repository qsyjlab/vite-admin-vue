/*
 * @Description: 创建空容器
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 15:37:49
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-19 16:53:28
 * @FilePath: \vite-admin-vue\src\layouts\container\createBlankContainer.ts
 */
import { h, defineComponent, KeepAlive } from 'vue'
import type { Component } from 'vue'
import { RouterView } from 'vue-router'
import { useRouteStore } from '@/store'

export default (name: string, alive = true): Component => {
  return defineComponent({
    name,
    setup() {
      // TODO: 类型优化  |  keepAlive 缓存
      const routeStore = useRouteStore()
      return () =>
        h(
          RouterView,
          {},
          {
            default: props => {
              if (alive)
                return h(
                  KeepAlive,
                  // { include:  routeStore.ge  routeStore.getters['route/getAlive'](name) },
                  {},
                  props.Component
                )
              return () => h(props.Component)
            }
          }
        )
    }
  })
}
