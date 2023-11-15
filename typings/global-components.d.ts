export {}

declare module 'vue' {
  export interface GlobalComponents {
    ProTable: typeof import('../src/components')['ProTable']
    ProForm: typeof import('../src/components')['ProForm']
    PageWrapper: typeof import('../src/components')['PageWrapper']
    PageCard: typeof import('../src/components')['PageCard']
    EchartsRenderer: typeof import('../src/components')['EchartsRenderer']
  }
}
