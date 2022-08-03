/*
 * @Description: eslint + vue + ts + prettier 整合配置文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:36:51
 * @LastEditors: qsyj
 * @LastEditTime: 2022-08-03 13:16:16
 * @FilePath: \vite-admin-vue\.eslintrc.js
 */
module.exports = {
  root: true,
  env: {
    node: true
    // 'vue/setup-compiler-macros': true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    // package @typescript-eslint/parser
    parser: '@typescript-eslint/parser', // ts解析器，vue解析器在遇到ts时使用ts解析器
    // ecmaVersion: 'latest', // 最新的语法也不会报错
    sourceType: 'module',
    ecmaVersion: 2020
  },
  extends: [
    // package eslint
    'eslint:recommended',
    // package eslint-plugin-vue
    'plugin:vue/vue3-recommended',
    // package @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended',
    // package eslint + eslint-plugin-vue
    'plugin:vue/vue3-essential',
    // package eslint-plugin-prettier + prettier
    'plugin:prettier/recommended',
    // package  prettier
    'prettier',
    // package @vue/eslint-config-typescript
    '@vue/typescript/recommended',
    '@vue/prettier'

    // '@vue/prettier/@typescript-eslint'
  ],
  // plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    // 要求使用 === 和 !==
    eqeqeq: 'warn',
    // 禁止 if 语句中 return 语句之后有 else 块
    'no-else-return': 'warn',
    // 禁止多次声明同一变量
    'no-redeclare': 'off',
    // 禁止变量声明与外层作用域的变量同名
    'no-shadow': 'off',

    // 关闭缩进检测 使用  prettier
    'no-undef': 0,
    // 强制在圆括号内使用一致的空格
    'space-in-parens': 'warn',
    // 要求操作符周围有空格
    'space-infix-ops': 'warn',
    'vue/comment-directive': 'off',
    // 'vue/setup-compiler-macros': true,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 0,
    // 'vue/html-self-closing': 'off',
    // 多单词关闭
    'vue/multi-word-component-names': 'off',

    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-empty-function': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
