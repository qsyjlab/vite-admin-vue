# 使用

## 环境准备

项目基于 Nodejs, 以及包管理器 pnpm

::: warning 注意

- 关于 node 环境推荐 nvm 来管理
- node.js 最低为 12.x 以上, pnpm 最低支持 5x node.js 12 版本，项目内推荐 pnpm 8 ,node.js 16x。[详见](https://pnpm.io/installation)
  :::

## 安装

### 安装 pnpm

```sh
npm install -g pnpm
```

pnpm 使用方法具体详见官网

## scripts

```json
  "scripts": {
    "dev": "vite",
    "app:host": "vite --host",
    "app:prod": "pnpm run app:host --mode prod",
    "build": "vite build",
    "build:prod": "vite build --mode prod",
    "check": "vue-tsc --noEmit --skipLibCheck",
    "preview": "vite preview",
    "prettier": "prettier --write .",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "prepare": "husky install",
    // 移除 库
    "clean:lib": "rimraf node_modules",
    // 移除 输出产物文件夹
    "clean:output": "rimraf .output",
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

```shell
git clone https://github.com/qsyjlab/vite-admin-vue.git
```

### Gitee

```shell
git clone https://gitee.com/qsyj0522/vite-admin-vue.git
```
