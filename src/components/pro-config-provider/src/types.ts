export interface ProConfigProviderProps {
  proTable?: {
    transform?: (data: any) => any
    transformParams?: (params: any) => any
  }
}
