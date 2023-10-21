# 外部模块引入

以安装 element-plus 为例

```shell
pnpm i element-plus

```

```ts
// src/plugins/elementPlus/index.ts

// 需要单独引入的css 样式路径
import './css'

// 因使用 unplugin 自动注册 需要使用动态组件时需要实际注册
import * as components from './el'

import { defineAppPlugin } from '@/utils'

export default defineAppPlugin(app => {
  Object.keys(components).forEach(item => {
    app.use(components[item as unknown as keyof typeof components])
  })
})
```

插件引入入口

```ts
//  src/plugins/index.ts

export default defineAppPlugin(app => {
  // 进度条
  setupProgress(app)
  // pinia
  setupPinia(app)
  // dayjs
  setUpDayJs(app)
  // elementPlus
  setupElementPlus(app)
  // custom global components
  registerGlobalComponents(app)

  // windicss
  setupWindicss(app)

  /**
   * vite-plugin-svg-icons 虚拟路径
   */
  import('./vite-plugin-svg-icons')
})
```

main.ts 最终会执行

```ts
async function setupWebApp() {
  const app = createApp(App)

  app.use(setUpPlugins)

  app.use(setUpDirective)
  app.use(setupRouter)
  app.mount(root)
}

setupWebApp()
```

注意： 默认情况下插件的导入统一入口都是从 `plugin` 作为实际的引入入口方便后面的统一替换。关于 是否使用 vue 的注册则是根据实际需要来使用。`plugin` 文件夹更多是为了需要进行应用启动时的插件初始化。

一些特例则可以不需要从 `plugin` 统一引入。
例如： `lodash-es` ,或者是 `xlsx` 这种工具库 可以进行统一封装到 `utils` 文件中。
