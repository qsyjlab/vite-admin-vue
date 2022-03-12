/*
 * @Description: prettier prettier 配置文件
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:36:12
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-13 00:53:05
 * @FilePath: \vite-admin-vue\.prettierrc.js
 */

module.exports = {
    semi: false,
    singleQuote: true,
    trailingComma: 'none',
    // 行宽度
    printWidth: 80,
    // 缩进宽度 =》editorconfig
    tabWidth: 4,
    // 单个参数取消空格
    arrowParens: 'avoid',
    bracketSpacing: true,
    // 关闭 prettier tslint 格式校验
    tslintIntegration: false,

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
