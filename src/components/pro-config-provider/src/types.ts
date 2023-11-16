import { CustomRendererFn } from '@/components/pro-table/src/types'

export interface ProConfigProviderProps {
  proTable?: {
    transform?: (respose: any) => { total: number; data: any[] }
    transformParams?: (params: any) => any
    rendererMap?: Record<string, CustomRendererFn>
  }
}
