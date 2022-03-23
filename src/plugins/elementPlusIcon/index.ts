/*
 * @Description: 注册全局 icon 组件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-16 11:33:39
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-23 23:19:54
 * @FilePath: \vite-admin-vue\src\plugins\elementPlusIcon\index.ts
 */
import { App, Component, h } from 'vue'
import { defineComponent } from 'vue'

import { ElIcon } from 'element-plus'

import * as icons from './icon'

/**
 * 包装 element 图标
 * @param name
 * @param icon
 * @returns
 */
export function renderIcon(name: string, icon: Component) {
  return defineComponent({
    name,
    props: {
      size: {
        type: Number,
        default: 20
      },
      color: {
        type: String,
        default: ''
      }
    },
    render() {
      return h(
        ElIcon,
        {
          size: this.size,
          color: this.color
        },
        () => h(icon)
      )
    }
  })
}

/**
 * 注册全局 icon
 * @param {App} app
 */
export const setUpIcon = (app: App): void => {
  Object.entries(icons).forEach(([key, value]) => {
    const _icon = renderIcon('Icon' + key, value)
    app.component(_icon.name, _icon)
  })
}

export { setUpIcon as default }
