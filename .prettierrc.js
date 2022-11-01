/**
 * @type { import('prettier').Options }
 */
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  // 行宽度
  printWidth: 100,
  // 缩进宽度 =》editorconfig
  tabWidth: 2,
  useTabs: false,
  // 单个参数取消空格
  arrowParens: 'avoid',
  bracketSpacing: true,
  // proseWrap: 'preserve',
  // "proseWrap": "never"
  // 关闭 prettier tslint 格式校验
  // tslintIntegration: false,
  // eslintIntegration: false,
  // stylelintIntegration: false,
  // 配置 html 格式化
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'html'
      }
    }
  ]
}

// {
//     "semi": false,
//     "singleQuote": true,
//     "trailingComma": "none",
//     "printWidth": 100,
//     "tabWidth": 4,
//     "arrowParens": "avoid",
//     "bracketSpacing": true,
//     "tslintIntegration": false,
//     "overrides": [
//         {
//             "files": "*.html",
//             "options": {
//                 "parser": "html"
//             }
//         }
//     ]
// }
