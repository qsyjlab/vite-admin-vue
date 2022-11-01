declare module 'vue' {
  export interface GlobalComponents {
    QsForm: typeof import('./index')['Form']
    QsSelect: typeof import('./index')['Select']
    QsCheckboxGroup: typeof import('./index')['CheckboxGroup']
    QsTable: typeof import('./index')['Table']
    QsUpload: typeof import('./index')['Upload']
  }
}

export {}
