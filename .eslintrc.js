/*
 * @Description:
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:36:51
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-11 09:25:29
 * @FilePath: \vite-admin-vue\.eslintrc.js
 */
module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // ts解析器，vue解析器在遇到ts时使用ts解析器
    // ecmaVersion: 'latest', // 最新的语法也不会报错
    sourceType: 'module',
    ecmaVersion: 2020
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  // parserOptions: {

  // },
  rules: {
    'no-undef': 0,
    // 'vue/setup-compiler-macros': true,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': ['off'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
