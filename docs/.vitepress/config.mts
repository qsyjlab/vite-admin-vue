import { defineConfig } from 'vitepress'
import { transformDemo } from './plugins/transform-demo'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Vite Admin Vue',
  description: ' ',
  base: '/vite-admin-vue/',
  srcDir: 'packages',
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
      { text: 'Home', link: '/' },
      { text: '指南', link: '/doc/guide/doc' },
      { text: '组件', link: '/components/guide.md' },
      {
        text: '文档',
        items: [
          {
            text: '@vitejs/plugin-legacy 中文文档',
            link: 'https://qsyjlab.github.io/doc-library/vite/plugin-legacy.html'
          }
        ]
      }
    ],
    sidebar: {
      '/doc': [
        {
          text: '开始',
          items: [
            { text: '简介', link: '/doc/guide/doc' },
            { text: '使用', link: '/doc/guide/use' }
          ]
        },
        {
          text: '路由',
          items: [
            { text: '配置', link: '/doc/route/setting' },
            { text: '菜单', link: '/doc/route/menu' },
            { text: '路由刷新', link: '/doc/route/reload' },
            { text: '多标签页', link: '/doc/route/tab' }
          ]
        },
        {
          text: '权限',
          link: '/doc/permission/index.md'
        },
        {
          text: '网络请求',
          items: [
            { text: '接口联调', link: '/doc/http/index.md' },
            { text: 'service 工作逻辑', link: '/doc/http/service.md' }
          ]
        },

        {
          text: '外部模块引入',
          link: '/doc/other/out-module.md'
        },
        {
          text: '其他',
          items: [
            { text: '图标', link: '/doc/other/icon' },
            { text: '暗黑主题', link: '/doc/other/theme' },
            { text: '自动导入插件', link: '/doc/other/auto-import' }
          ]
        }
      ],
      '/components': [
        { text: '简介', link: '/components/guide.md' },
        { text: '全局配置 ProConfigProvider', link: '/components/pro-config-provider.md' },
        { text: '高级表格 ProTable', link: '/components/pro-table.md' },
        { text: '高级表单 ProForm', link: '/components/pro-form.md' },
        { text: '锚点组件 anchor', link: '/components/anchor.md' },
        { text: '二维码组件 qrcode', link: '/components/qrcode.md' },
        { text: '分段器 segmented', link: '/components/segmented.md' }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/qsyjlab/Vite Admin Vue' }]
  }
})
