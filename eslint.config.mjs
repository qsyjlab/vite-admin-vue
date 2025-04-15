import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import tseslint from 'typescript-eslint'
import VueEslintParser from 'vue-eslint-parser'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: { globals: globals.browser }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
        // ...autoImportConfig.globals // 合并自动导入的 globals
      },
      parser: VueEslintParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    plugins: {
      prettier: prettier
    },
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

      // 禁止使用any （不禁止 不可能不是用 any）
      '@typescript-eslint/no-explicit-any': ['off'],
      // 是否有空函数体
      '@typescript-eslint/no-empty-function': 'warn',
      // 禁用 ts 注释
      '@typescript-eslint/ban-ts-comment': 'off'
    },
    ignores: ['node_modules', 'dist', 'public', '*.md', '.output']
  }
]
