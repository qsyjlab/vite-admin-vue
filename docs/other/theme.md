# 主题

项目内已经集成 动态改变主题色, 切换 暗黑模式的功能。

::: warning 注意

`element-plus` 默认是支持 暗黑模式的，但是如果你使用了非 `element-plus` 的 ui 组件等，需要自行根据项目中的变量实现自己的暗黑模式条件。
:::

## 变更主题配色

`element-plus` 基于 scss 处理器处理 css。但并不是使用 scss 变量，使用原生 `css-var`。可以通过覆盖 `css-var`来实现变更主题色。

在 root 中覆盖

```css
:root {
  --el-color-primary: #1677ff;
  --el-button-bg-color: #1677ff;
  --el-button-active-bg-color: #eaf6ff;
  --el-button-active-border-color: #eaf6ff;
  --el-color-primary-dark-2: #00164d;
  --el-color-primary-dark-1: #00164d;
  --el-color-primary-light-1: #00164d;
  --el-color-primary-light-2: #042979;
  --el-color-primary-light-3: #0e44a6;
  --el-color-primary-light-4: #1d62d2;
  --el-color-primary-light-5: #3086ff;
  --el-color-primary-light-6: #3c94ff;
  --el-color-primary-light-7: #68b1ff;
  --el-color-primary-light-8: #93caff;
  --el-color-primary-light-9: #bee2ff;
}
```

也可以针对某个元素的变量单独覆盖某个元素的变量。

### 如何动态改变变量

通过 js 来生成主要变量的色阶 , 通过 style 动态设置 `css-var`

```ts
import { generateThemeCluster } from '@/utils'

import { generate } from '@arco-design/color'

export const useElementCssVar = (mode?: 'light' | 'dark') => {
  const el = document.documentElement

  const style = el.style

  mode = mode || 'light'

  const setElementCssVar = (color: string, mode?: 'light' | 'dark'): void => {
    let colorList: string[] = []

    if (mode === 'light') {
      colorList = generateThemeCluster(color)
    } else {
      colorList = generate(color, { index: 10, list: true, dark: true })
      colorList.unshift(color)
    }

    // set css var
    style.setProperty('--el-color-primary', colorList[0])
    style.setProperty('--el-button-bg-color', colorList[0])
    style.setProperty('--el-button-active-bg-color', colorList[10])
    style.setProperty('--el-button-active-border-color', colorList[10])
    style.setProperty('--el-color-primary-dark-2', colorList[1])
    style.setProperty('--el-color-primary-dark-1', colorList[1])
    for (let index = 1; index <= 9; index++) {
      style.setProperty(`--el-color-primary-light-${index}`, colorList[index])
    }
  }
  const removeElementCssVar = () => {
    style.removeProperty('--el-color-primary')
    style.removeProperty('--el-button-bg-color')
    style.removeProperty('--el-button-active-bg-color')
    style.removeProperty('--el-button-active-border-color')
    style.removeProperty('--el-color-primary-dark-2')
    style.removeProperty('--el-color-primary-dark-1')
    for (let index = 1; index <= 9; index++) {
      style.removeProperty(`--el-color-primary-light-${index}`)
    }
  }

  return {
    setElementCssVar,
    removeElementCssVar
  }
}
```

## 暗黑主题

暗黑主题 `element-plus` 已内置。

### 如何使用 暗黑模式

```html
<html class="dark">
  <head></head>
  <body></body>
</html>
```

```ts
// main.ts
// 如果只想导入css变量
import 'element-plus/theme-chalk/dark/css-vars.css'
```

[更多详情](https://element-plus.gitee.io/zh-CN/guide/dark-mode.html)
