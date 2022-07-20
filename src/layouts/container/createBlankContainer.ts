/*
 * @Description: 创建空容器
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 15:37:49
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 11:32:28
 * @FilePath: \vite-admin-vue\src\layouts\container\createBlankContainer.ts
 */
import { h, defineComponent, KeepAlive } from 'vue'

import type { Component, VNode } from 'vue'
import { RouterView } from 'vue-router'

import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { useRouteStore } from '@/store'

interface RouteViewDefaultSlotProps {
  Component: VNode
  route: RouteLocationNormalizedLoaded
}

export default (name: string, alive = true): Component => {
  return defineComponent({
    name,
    setup() {
      const routeStore = useRouteStore()
      return () =>
        h(
          RouterView,
          {},
          {
            default: (props: RouteViewDefaultSlotProps) => {
              if (alive)
                return h(
                  KeepAlive,

                  {
                    include: routeStore.getAlive(name)
                  },
                  props.Component
                )
              return () => h(props.Component)
            }
          }
        )
    }
  })
}
