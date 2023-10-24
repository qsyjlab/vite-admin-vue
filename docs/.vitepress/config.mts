import { defineConfig } from 'vitepress'
import { transformDemo } from './plugins/transform-demo'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'vite-admin-vue',
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
      { text: '组件', link: '/components/guide.md' }
    ],
    sidebar: {
      '/doc': [
        {
          text: '开始',
          items: [
            { text: '简介', link: '/doc/guide/doc' },
            { text: '使用', link: '/doc/guide/use' },
            { text: '目录说明', link: '/doc/guide/contents' }
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
          link: '/other/out-module.md'
        },
        {
          text: '其他',
          items: [
            { text: '图标', link: '/other/icon' },
            { text: '暗黑主题', link: '/other/theme' },
            { text: '目录说明', link: '/guide/contents' },
            { text: '自动导入插件', link: '/other/auto-import' }
          ]
        }
      ],
      '/components': [
        { text: '简介', link: '/components/guide.md' },
        { text: '高级表格 ProTable', link: '/components/pro-table.md' },
        { text: '高级表单 ProForm', link: '/components/pro-form.md' },
        { text: '锚点组件 anchor', link: '/components/anchor.md' },
        { text: '二维码组件 qrcode', link: '/components/qrcode.md' },
        { text: '分段器 segmented', link: '/components/segmented.md' }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/qsyjlab/vite-admin-vue' }]
  }
})
