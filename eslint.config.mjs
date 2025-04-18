import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import pluginPrettier from 'eslint-plugin-prettier/recommended'

const ignores = ['node_modules', 'dist', '.output', 'public', 'docs/.vitepress/**', '.output']

export default defineConfig([
  globalIgnores(ignores),
  {
    files: ['**/*.{ts,js,mjs,cjs,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.vue', '**/*.ts'],
    extends: [pluginVue.configs['flat/recommended']],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        jsx: true
      }
    },
    rules: {
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
      // 禁止使用any
      '@typescript-eslint/no-explicit-any': ['off'],
      // 是否有空函数体
      '@typescript-eslint/no-empty-function': 'warn',
      // 禁用 ts 注释
      '@typescript-eslint/ban-ts-comment': 'off'
    }
  },
  pluginPrettier,
  {
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }]
    }
  }
])
