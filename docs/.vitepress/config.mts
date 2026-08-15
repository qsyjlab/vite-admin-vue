import { defineConfig } from 'vitepress'
import { transformDemo } from './plugins/transform-demo'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vite Admin Vue',
  description: '基于 Vue3 + Vite + Element Plus + TypeScript 的中后台管理系统框架',
  base: '/vite-admin-vue/',
  markdown: {
    config(md) {
      transformDemo(md)
    }
  },
  vite: {
    plugins: []
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/intro' },
      { text: '组件', link: '/components/guide' },
      {
        text: '外部文档',
        items: [
          {
            text: '@vitejs/plugin-legacy 中文文档',
            link: 'https://qsyjlab.github.io/doc-library/vite/plugin-legacy.html'
          }
        ]
      }
    ],
    sidebar: {
      '/guide': [
        {
          text: '开始',
          items: [
            { text: '简介', link: '/guide/intro' },
            { text: '快速使用', link: '/guide/quick-start' },
            { text: '目录结构', link: '/guide/structure' }
          ]
        }
      ],
      '/components': [
        { text: '简介', link: '/components/guide' },
        {
          text: 'Pro 组件',
          items: [
            { text: 'ProConfigProvider 全局配置', link: '/components/pro/pro-config-provider' },
            { text: 'ProTable 高级表格', link: '/components/pro/pro-table' },
            { text: 'ProForm 高级表单', link: '/components/pro/pro-form' },
            { text: 'ProCard 卡片', link: '/components/pro/pro-card' },
            { text: 'ProDescriptions 描述列表', link: '/components/pro/pro-descriptions' },
            { text: 'ProList 列表', link: '/components/pro/pro-list' },
            { text: 'ProTree 树', link: '/components/pro/pro-tree' },
            { text: 'ProTabs 标签页', link: '/components/pro/pro-tabs' },
            { text: 'ProFeedback 反馈', link: '/components/pro/pro-feedback' }
          ]
        },
        {
          text: '基础组件',
          items: [
            { text: 'Icon 图标', link: '/components/basic/icon' },
            { text: 'PageCard 页面卡片', link: '/components/basic/page-card' },
            { text: 'Authority 权限', link: '/components/basic/authority' },
            { text: 'Anchor 锚点', link: '/components/basic/anchor' },
            { text: 'Segmented 分段器', link: '/components/basic/segmented' },
            { text: 'Qrcode 二维码', link: '/components/basic/qrcode' },
            { text: 'Watermark 水印', link: '/components/basic/watermark' },
            { text: 'Echarts 图表', link: '/components/basic/echarts' },
            { text: 'Tree 树', link: '/components/basic/tree' }
          ]
        }
      ],
      '/modules': [
        {
          text: '路由',
          items: [
            { text: '路由配置', link: '/modules/route/setting' },
            { text: '菜单', link: '/modules/route/menu' },
            { text: '路由刷新', link: '/modules/route/reload' },
            { text: '多标签页', link: '/modules/route/tab' }
          ]
        },
        {
          text: '权限',
          items: [
            { text: '权限模式', link: '/modules/permission/index' },
            { text: '组件级鉴权', link: '/modules/permission/component' }
          ]
        },
        {
          text: '布局',
          items: [
            { text: '布局模式', link: '/modules/layout/index' },
            { text: '布局配置', link: '/modules/layout/config' }
          ]
        },
        {
          text: '网络请求',
          items: [
            { text: '接口联调', link: '/modules/http/index' },
            { text: 'service 工作逻辑', link: '/modules/http/service' },
            { text: 'Mock 数据', link: '/modules/http/mock' }
          ]
        },
        {
          text: '状态管理',
          items: [{ text: 'Pinia Store', link: '/modules/store/index' }]
        }
      ],
      '/engineering': [
        {
          text: '工程化',
          items: [
            { text: '构建与部署', link: '/engineering/build' },
            { text: '代码规范', link: '/engineering/lint' },
            { text: '测试', link: '/engineering/test' }
          ]
        }
      ],
      '/other': [
        {
          text: '其他',
          items: [
            { text: '图标', link: '/other/icon' },
            { text: '暗黑主题', link: '/other/theme' },
            { text: '自动导入插件', link: '/other/auto-import' },
            { text: '外部模块引入', link: '/other/out-module' }
          ]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/qsyjlab/vite-admin-vue' }]
  }
})
