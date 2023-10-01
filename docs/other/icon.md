# 图标



## 组件库图标

`@element-plus/icons-vue` 项目已集成需要单独引入使用


## 外部 svg 图标

`vite-plugin-svg-icons` 通过这个插件生成 `svg` 精灵图


目标路径：`src\assets\svg-icons`

路径内部存放.svg 文件

## 图标选择器

``` tsx
import { IconSelector } from '@/components/icon'

// element-plus 这个图标需要到组件内部中的map 中进行注册
<IconSelector :size="18" icon="ep.图标名称" color="" />


// 外部 svg 图标
<IconSelector :size="18" icon="svg.图标名称" color="" />


// iconify
<IconSelector :size="18" icon="ify.图标名称" color="" />

```
``` vue
  <!-- svg 精灵图 -->
  <svg-icon v-if="iconType === 'svg'" :name="iconName" :size="size" :color="color" />

  <!-- iconify -->
  <iconify v-else-if="iconType === 'ify'" :icon="iconName" :size="size" :color="color" />

  <!-- element-plus -->
  <ep-icon v-else-if="iconType === 'ep'" :icon="iconName" :size="size" :color="color" />
  <span v-else></span>
```



## iconify (暂时不推荐使用)

暂未有一个较为妥当的整合，这个图标库的执行原理是定义 path,这个 path 是从外部网站的资源中请求过来的，这对于内网需要的情况 无法满足。  虽也可以使用静态依赖下载到本地中，但是依赖包 200mb 以上，还需要自己通过node 服务生成。基于此类对接的插件服务过多，没有一个较为稳定的使用标准。但是 图标官方仍然提供了在线的 svg 的下载服务，可以通过直接通过 外部 svg 图标的方式引入。