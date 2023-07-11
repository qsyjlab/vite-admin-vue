module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-standard-vue',
    'stylelint-config-prettier'
  ],
  // 不同格式的文件指定自定义语法
  overrides: [
    {
      files: ['**/*.(scss|css|vue|html)'],
      customSyntax: 'postcss-scss'
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html'
    }
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml',
    '**/*.vue'
  ],
  rules: {
    // 'string-quotes': 'single',
    // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
    'no-descending-specificity': null,
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ],
    'selector-class-pattern': null,
    'import-notation': 'string',
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep']
      }
    ],
    // 禁用每个选择器之前插入空行
    'rule-empty-line-before': null,
    'declaration-block-no-duplicate-properties': null,
    'selector-anb-no-unmatchable': null,
    'selector-anb-no-unmatchable': null
  }
}
