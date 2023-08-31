## todoList

### 权限相关

#### 路由权限

- ~~路由 mapping~~

  以`name` 或一个唯一值 作为权限字段 最终生成路由表

- 按角色权限 (暂不做处理，具体业务问题)

  路由表中新增角色数组 根据角色信息 生成路由表

- 后端菜单 (优先度不高 业务需要)

  后端菜单 直接返回路由表数据与 前端路由表做注册

  期望值: 可以进行详细的配置,排序,合并菜单,移动菜单,修改名称

  可能会存在的问题：移动权限菜单会出现匹配混乱的问题，与实际路由文件出入过大 （同样是业务问题）

- ~~退出后需要清除掉路由~~

- 退出后重定向问题

  > 暂时放置，问题是重定向时出现得路由是否还会存在，在启用权限时

- ~~退出后一些 reset 的预留~~

> 角色权限 和 后端菜单 优先度不高 , 需要时处理生成的 menuFilter

#### 按钮权限

- ~~v-if~~

- ~~组件插槽~~

- 指令权限

  指令权限不做的原因： 指令是在 mounted 阶段做的事，是先渲染 在 移除 dom 这时候性能消耗，或者接口调用可能已经被执行过了

### 组件相关

##### pro-table

- ~~基本表格的渲染~~
- ~~request 请求数组 | 本地化静态数据~~
- ~~可自定义列内容~~
- ~~可自定义表头~~
- ~~表头 `tip` 提示~~
- ~~操作栏 密度大小切换~~
- ~~列设置 （隐藏,显示,拖拽排序, local 缓存功能）~~
- ~~刷新按钮~~
- 列内容 `valueType` | `valueEnum` 内容拓展

##### editableProTable

在这之前需要把表单部分拓展完成

- 基本表单渲染

- 自定义组件

- 表单组件数据同步

- 表单验证

- 待定

##### pro-form

- `Schema` 表单

  - 配置项 （验证规则等）
  - 表单 label tip 提示
  - Grid 布局
  - 展开/ 折叠 表单功能
  - 提供外部访问 api 方法 `useProForm` hook 提供外部自定义按钮能力
  - 新增, 删除，更新 配置项
  - 后续 editableProTable 提供拓展功能

> 组件部分目的为提供一个 像 `@ant-design/pro-components` 简单易用, 提供更多的预设,解决大部分场景的重复行为

##### watermark 水印组件

- ~~指令水印~~
- ~~组件水印·~~
- ~~hook 水印~~

##### loading 动画

- 拓展多个不同的 loading 动画
- 实现 api 调用
- 实现指令调用、

##### qrcode 二维码组件

- ~~二维码组件 生成二维码~~
- ~~二维码添加 logo~~
- 二维码 logo 样式 自定义
- 二维码 自定义样式

##### icon 组件

- 统一 icon 图标入口

- 可拓展性 （不受库的限制）,尝试采用 svg 进行拓展
- 大小颜色可自定义
- 考虑动态引入

##### 分段控制器

https://ant.design/components/segmented-cn

##### 试图部分容器布局组件

- page-wrapper

- page-header

- page-card

  组件解决大部分 el ui 原有 样式对于 现有样式的不一致，但 el-card 的样式可能有时又需要 但 preset 预设 视乎行不通

- 三栏 ， 二栏布局 组件

#### http 请求相关

##### useFetch

源自 nuxt2 期望实现 use 效果

##### axios

- ~~基本封装~~
- ~~基本类型提供~~
- 拓展性提供可拓展的接口 为后续 useFetch 提供
- ~~业务状态处理~~ （这个根据具体业务调整）
- （新增）http 状态码错误处理
- ~~cancelToken 问题 解决~~
- 关于错误处理的粒度问题

### 整体主题相关

#### 布局风格细节调整 （暂定）

关于样式风格需要有一个完整的风格设计

#### 开放更多的样式配置

- 统一各个自定义项的 css-var

- 基础模版的布局配色

- 更灵活的配置菜单切换布局

- 灵活移除,变更布局

- 提供外部调用 api

- 期望布局更独立 , 启用单独的 store 并注册到 store 中单独调用而不是直接保存到 store。

  好处: 更方便的移植 后期提取 npm 中。 如果需要发布到 npm 中需要考虑 使用的依赖以及 通用性

#### 独立出 setting 模块 来提供部分预设

#### ~~router-bar 缓存~~

##### 开启 router-bar

开启 router-bar 标签 存在时开启缓存，优先级小于 忽略缓存 如果忽略缓存则不计入缓存，反之计入缓存

对 详情页面需要特别设置

- ~~提供 setTitle 方法来动态设置标题~~
- ~~衍生出来的问题，因为是同一个组件 并且同时处于在 缓存状态 是否他可以通过 `onMountedOrActivated` 这个复合 hook 来解决~~

##### 关闭 router-bar

关闭 router-bar 仅需考虑是否需要缓存

tab-page 图标相关

#### 返回顶部按钮

#### 面包屑导航相关

- icon 图标 添加

##### ~~reload 页面~~

### docs 文档

#### nvm 相关

计划 加入 .nvmrc 相关 但是 windows 版本的 nvm 似乎不支持工作区的 nvm 切换

linux/unix 系统则支持

暂定解决方法

### 基础模块的生成 （长期任务）

#### 关于首屏的 loading 动画

loading 动画目前是一个固定的东西，但有时候需要一个额外的定制这时候需要写一些样式什么东西 这时候希望可以将 vue 的 template 在最终编译阶段转成原生的 dom 。但这设计一些问题。

dom 以及样式都是静态的。既然是首屏的东西 js 这东西就不可能加载 否则这个 loading 就没什么太大的意义。

但，可以尝试发掘一些可行性。例如 虽然只是一些静态编译 但是可以隔离开 对 index.html 的操作。部分样式文件也可以进行单独的分离。我可以

### 自动化部署相关

#### nginx

#### docker

#### ci