# 简介

## 介绍

Vite Admin Vue 是一个基于 Vue3.5 + Vite 8 + Element Plus 2.9 + TypeScript 5.8 + Pinia 3 + Vue Router 4.5 的中后台管理解决方案。项目采用 pnpm workspace monorepo 管理，内置动态路由、多标签页、多布局模式、Mock 数据、暗黑主题以及 Pro 组件库，可以作为项目的启动模版。

## 内置能力

- **动态路由**：支持 3 种权限模式（角色权限 `ROLE`、路由权限映射 `ROUTE_MAPPING`、后端菜单映射 `BACKED`），可按需切换。
- **多标签页**：基于路由的标签栏，支持缓存策略、固定标签、关闭/刷新等操作。
- **多布局模式**：侧边栏、顶部导航、混合模式（侧边/顶部混合），可在运行时切换并持久化。
- **Mock 数据**：基于 MSW（Mock Service Worker）拦截请求，开发环境默认启用，可按环境开关。
- **暗黑主题**：支持明/暗主题切换与主题色定制。
- **Pro 组件库**：内置 `@framebase/element-plus-pro-components`，提供 ProTable、ProForm、ProCard 等业务组件。
- **代码编辑器**：内置 `@framebase/vue-code-editor`。
- **主题工具**：内置 `@framebase/element-plus-theme`。

## Monorepo 内部包

项目通过 pnpm workspace 管理以下内部包：

| 包名                                     | 说明                                  |
| ---------------------------------------- | ------------------------------------- |
| `@framebase/element-plus-pro-components` | 基于 Element Plus 的业务级 Pro 组件库 |
| `@framebase/vue-code-editor`             | Vue 代码编辑器封装                    |
| `@framebase/element-plus-theme`          | Element Plus 主题工具                 |

## 测试

- **单元测试**：vitest，支持 `--ui` 可视化界面。
- **类型测试**：vue-tsc，基于 `tsconfig.type-tests.json`。
- **端到端测试**：playwright。

## 环境要求

- Node >= 20.19
- pnpm >=10 <11

## 文档

文档采用 Vitepress 开发。如发现文档有误，欢迎提 PR 帮助我们改进。

## 项目需要知晓

- [vue3](https://cn.vuejs.org/)
- [vue-router@4+](https://router.vuejs.org/zh/)
- [pinia](https://pinia.vuejs.org/zh/)
- [Element Plus](https://element-plus.org/zh-CN/)
- [vite](https://cn.vitejs.dev/)
- [typescript](https://www.typescriptlang.org/zh/)

## 关于浏览器支持

本地开发推荐使用 Chrome 最新版浏览器，不支持 Chrome 80 以下版本。

浏览器支持情况详情见 vite 官网，IE 确认不支持。

[浏览器支持](https://cn.vitejs.dev/guide/#browser-support)
