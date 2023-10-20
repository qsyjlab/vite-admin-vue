import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "vite-admin-vue",
  description: " ",
  base:'/vite-admin-vue/',
  markdown: {},
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "指南", link: "/guide/doc" },
      { text: "组件", link: "/components/guide.md" },
    ],
    sidebar: {

      // "/" :[
      //     {
      //       text: "开始",
      //       items: [
      //         { text: "简介", link: "/guide/doc" },
      //         { text: "使用", link: "/guide/use" },
      //         { text: "目录说明", link: "/guide/contents" },
      //       ],
      //     },
      //     {
      //       text: "路由",
      //       items: [
      //         { text: "配置", link: "/route/setting" },
      //         { text: "菜单", link: "/route/menu" },
      //         { text: "路由刷新", link: "/route/reload" },
      //         { text: "多标签页", link: "/route/tab" },
      //       ],
      //     },
      //     {
      //       text: "权限",
      //       link: "/permission/index.md",
      //     },
      //     {
      //       text: "网络请求",
      //       items: [
      //         { text: "接口联调", link: "/http/index.md" },
      //         { text: "service 工作逻辑", link: "/http/service.md" },
      //       ],
      //     },

      //     {
      //       text: "外部模块引入",
      //       link: "/other/out-module.md",
      //     },
      //     {
      //       text: "其他",
      //       items: [
      //         { text: "图标", link: "/other/icon" },
      //         { text: "暗黑主题", link: "/other/theme" },
      //         { text: "目录说明", link: "/guide/contents" },
      //         { text: "自动导入插件", link: "/other/auto-import" },
      //       ],
      //     },
      // ],
      "/components": [
        { text: "简介", link: "/components/guide.md" },
        { text: "高级表格 ProTable", link: "/components/pro-table.md" },
        { text: "锚点组件 anchor", link: "/components/anchor.md" },
        { text: "二维码组件 qrcode", link: "/components/qrcode.md" },
        { text: "分段器 segmented", link: "/components/segmented.md" },
      ]
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
