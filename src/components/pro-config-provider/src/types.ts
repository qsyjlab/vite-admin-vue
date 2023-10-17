export interface ProConfigProviderProps {
  proTable?: {
    transform?: (respose: any) => { total: number; data: any[] }
    transformParams?: (params: any) => any
  }
}
