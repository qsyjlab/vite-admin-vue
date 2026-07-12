export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'
export type OrderPriority = 'normal' | 'high' | 'urgent'

export interface OrderCustomer {
  id: string
  name: string
  contact: string
  phone: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  discountRate: number
  lineAmount: number
}

export interface OrderRecord {
  id: string
  orderNo: string
  customer: OrderCustomer
  owner: string
  status: OrderStatus
  priority: OrderPriority
  itemCount: number
  amount: number
  progress: number
  expectedDeliveryDate: string
  createdAt: string
  updatedAt: string
}

export interface OrderDetail extends OrderRecord {
  shippingAddress: string
  remark: string
  items: OrderItem[]
}

export interface OrderQuery {
  orderNo?: string
  customerName?: string
  owner?: string
  status?: OrderStatus
  createdFrom?: string
  createdTo?: string
}

export interface OrderPageQuery extends OrderQuery {
  current: number
  pageSize: number
}

export interface OrderPageResult {
  data: OrderRecord[]
  total: number
  success: boolean
}

export interface OrderFormModel {
  id?: string
  orderNo?: string
  customerId: string
  owner: string
  status: OrderStatus
  priority: OrderPriority
  expectedDeliveryDate: string
  shippingAddress: string
  remark: string
  items: OrderItem[]
}

export interface OrderOption {
  label: string
  value: string
  disabled?: boolean
}

export interface OrderProductOption extends OrderOption {
  sku: string
  unitPrice: number
}

export interface OrderMeta {
  customers: Array<OrderOption & Pick<OrderCustomer, 'contact' | 'phone'>>
  owners: OrderOption[]
  products: OrderProductOption[]
}

export interface OrderFieldError {
  name: string
  errors: string
}

export interface OrderValidationPayload {
  fieldErrors: OrderFieldError[]
}
