# 自动导入插件

下面讲讲关于自动导入插件相关的问题。

## unplugin-vue-components

这个插件的作用实际是帮你 import 组件。相关样式会根据插件来传入的 `resolver` 接处理样式的引入。

例如

```vue
<template>
  <el-button />
</template>

<script setup lang="ts">
// 会自动帮你添加这样的 import, 根据 resolver 的不同可能会引入一些样式等 import 语句
import { ElButton } from 'element-plus'
</script>
```

注意： 以上仅仅只是帮你自动引入， 在 `vue` appContext 上下文 中并没有被全局注册这会使得动态组件 `component :is` 写法失效。因为 component 组件是通过 `resolveComponent` api 来处理组件。回依次 找当前实例的注册组件，以及 appContext 上下文中的组件。所以部分需要在全局组件挂在的组件需要自己手动注册。

但问题也不止这些，一些以 api 方式调用的组件需要自己导入相关样式。但这应该和 `element-plus` 的 `resovler` 有些关系。

以上是 `0.1x.x` 版本的问题，虽然目前是 `0.2x.x`版本，但是 最新版本的插件 仍有在这以上的问题。

在 1x 的 版本中重复导入是会重复处理 这使得 import 语句重复仍然会导入这个组件，但是 2x 中这个东西得到了去重也就是说 自己导入的东西则不再处理，出现样式丢失的问题。这个问题 可以自己手动导入相关的样式，也可以 `unplugin-element-plus` 这个插件来进行弥补。

## unplugin-auto-import

插件做到的的自动导入实际和 `unplugin-vue-components` 的机制类似。可以导入一些 库的 api，不用写引入文件等。

但是缺点是容易造成项目混乱，除非你的项目组有绝对的编码规范，以及统一的配置，否则不建议使用。

这个插件并不会对你的项目提升太多的项目 ，可能还会对你的项目添加上手难度。即便是 有 ts 类型的支持

## unplugin-element-plus

这个插件做到的事实际 unplugin-vue-components 和这个插件类似。实际感觉是 和 `unplugin-vue-components` `ElementPlusResolver` 基本差不多的原理，但是并不会因为你的导入而影响了插件的导入逻辑。可以配合 `unplugin-vue-components` 共同使用弥补样式导入的问题。

仍然是全局组件问题。
