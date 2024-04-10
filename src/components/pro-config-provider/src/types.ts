import { CustomRendererFn } from '@/components/pro-table/src/types'

export interface ProConfigProviderProps {
  /** 针对通用性请求获取实际数据源 */
  responseHandler: (respose: any) => any
  proTable: {
    transform?: (respose: any) => { total: number; data: any[] }
    transformParams?: (params: any) => any
    rendererMap?: Record<string, CustomRendererFn>
    /** 对于最后渲染结果的处理 */
    customRenderAfter: (value: unknown) => any
  }
}
