import { Component, h } from 'vue'
import { defineComponent } from 'vue'

import { ElIcon } from 'element-plus'

import * as icons from './icon'
import { defineAppPlugin } from '@/utils'

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
        default: undefined
      },
      color: {
        type: String,
        default: undefined
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

export default defineAppPlugin(app => {
  Object.entries(icons).forEach(([key, value]) => {
    const _icon = renderIcon('Icon' + key, value)
    app.component(_icon.name, _icon)
  })
})
