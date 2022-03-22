/*
 * @Description: 创建空容器
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-17 15:37:49
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-22 11:41:17
 * @FilePath: \vite-admin-vue\src\layouts\container\createBlankContainer.ts
 */
import { h, defineComponent, KeepAlive } from 'vue'
import type { Component } from 'vue'
import { RouterView } from 'vue-router'
import { Transition } from '@/components'

export default (name: string): Component => {
  if (!name) {
    console.warn('You must provide a name for this function')
  }
  return defineComponent({
    name,

    render() {
      return h(
        RouterView,
        {},
        {
          default: props => {
            return h(Transition, {}, () => h(KeepAlive, { include: [] }, props.Component))
          }
        }
      )
    }
  })
}
