/**
 * @type { import('eslint').Linter.Config }
 */

module.exports = {
  root: true,
  env: {
    node: true
  },

  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    // 定义 Vue 组件标签上属性的顺序
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ]
      }
    ],
    // 多单词关闭
    'vue/multi-word-component-names': 'off',
    // 使用 a-b 风格 props
    'vue/attribute-hyphenation': ['error', 'always'],

    // 是否允许 Vue.js 模板中的注释指令
    'vue/comment-directive': 'off',
    // 是否显示声明返回值类型
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // 要求操作符周围有空格
    'space-infix-ops': 'warn',
    // 是否允许使用 require （esm项目不需要）
    '@typescript-eslint/no-var-requires': 0,
    // 'vue/html-self-closing': 'off',

    // 未使用的变量
    '@typescript-eslint/no-unused-vars': 'warn',
    // 禁止使用any （不禁止 不可能不是用 any）
    '@typescript-eslint/no-explicit-any': ['off'],
    // 是否有空函数体
    '@typescript-eslint/no-empty-function': 'warn',
    // 禁用 ts 注释
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
