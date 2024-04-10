export {}

declare module 'vue' {
  export interface GlobalComponents {
    PageWrapper: typeof import('../src/components')['PageWrapper']
    PageCard: typeof import('../src/components')['PageCard']
  }
}
