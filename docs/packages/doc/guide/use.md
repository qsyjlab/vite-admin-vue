# 使用

## 环境准备

项目基于 Nodejs, 以及包管理器 pnpm

::: warning 注意

- 关于 node 环境推荐 nvm 来管理
- node.js 最低为 12.x 以上, pnpm 最低支持 5x node.js 12 版本，项目内推荐 pnpm 8 ,node.js 16x。[详见](https://pnpm.io/installation)
  :::

## 安装

### Node.js

[整合 nvm 和 node](https://qsyjlab.club/article/317)

### 安装 pnpm

```sh
npm install -g pnpm
```

pnpm 使用方法具体详见官网

## scripts

```json
  "scripts": {
    // 启动
    "dev": "vite",
    // ip host 启动
    "app:host": "vite --host",
    // 不同mode 启动
    "app:prod": "pnpm run app:host --mode prod",
    "build": "vue-tsc --noEmit --skipLibCheck && vite build",
    "build:prod": "vite build --mode prod",
    // tsc 检查
    "check": "vue-tsc --noEmit --skipLibCheck",
    // 打包产出本地服务预览
    "preview": "vite preview",
    // prettier
    "prettier": "prettier --write .",
    // 检查项目循环引用
    "lint:code-recyle": "dpdm ./src/main.ts --no-warning",
    // 代码检查
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "lint:stylelint": "stylelint --cache --fix \"**/*.{css,less,vue,html}\" --cache --cache-location node_modules/.cache/stylelint/",
    "prepare": "husky install",
    // 命令行删除  依赖 rimraf 包
    "clean:lib": "rimraf node_modules"
  }
```

## 工具配置

推荐 IDE vscode

- volar 提供 vue, 及 ts 提示, 升级版的 vetur
- Eslint 代码检查
- prettier 代码风格格式化
- DotENV 提供 env 的 高亮

## 代码获取

### Github

### Gitee

```shell
git clone https://gitee.com/qsyj0522/vite-admin-vue.git
```
