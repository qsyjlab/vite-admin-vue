declare module 'vue' {
  export interface GlobalComponents {
    ProTable: typeof import('../src/components')['ProTable']
    ProForm: typeof import('../src/components')['ProForm']
  }
}
export {}
