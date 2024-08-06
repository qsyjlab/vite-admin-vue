export {}

declare module 'vue' {
  export interface GlobalComponents {
    PageWrapper: typeof import('../src/components')['PageWrapper']
    PageCard: typeof import('../src/components')['PageCard']
  }
  export interface ComponentCustomProperties {
    vWatermark: typeof import('../src/directive')['WatermarkDirective']
    vContextmenu: typeof import('../src/directive')['ContextMenuDirective']
    $hasAuthorize: typeof import('../src/access')['hasAuthorize']
    $hasRole: typeof import('../src/access')['hasRole']
  }
}
