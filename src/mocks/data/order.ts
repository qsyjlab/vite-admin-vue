import type {
  OrderCustomer,
  OrderDetail,
  OrderFieldError,
  OrderFormModel,
  OrderItem,
  OrderMeta,
  OrderPageQuery,
  OrderPageResult,
  OrderPriority,
  OrderProductOption,
  OrderRecord,
  OrderStatus
} from '../../api/order-types'

export const orderMeta: OrderMeta = {
  customers: [
    { label: '示例科技有限公司', value: 'customer-1', contact: '张伟', phone: '13800001001' },
    { label: '远航制造集团', value: 'customer-2', contact: '李娜', phone: '13800001002' },
    { label: '云图网络股份', value: 'customer-3', contact: '王强', phone: '13800001003' },
    { label: '新域零售有限公司', value: 'customer-4', contact: '陈晨', phone: '13800001004' },
    {
      label: '争议客户（提交时校验）',
      value: 'customer-risk',
      contact: '赵敏',
      phone: '13800001005'
    }
  ],
  owners: ['张伟', '李娜', '王强', '陈晨'].map(value => ({ label: value, value })),
  products: [
    { label: '企业级显示器', value: 'product-1', sku: 'MON-27-PRO', unitPrice: 2499 },
    { label: '机械键盘', value: 'product-2', sku: 'KEY-87-RGB', unitPrice: 699 },
    { label: '无线鼠标', value: 'product-3', sku: 'MOU-WL-02', unitPrice: 329 },
    { label: '扩展坞', value: 'product-4', sku: 'HUB-12-IN-1', unitPrice: 899 },
    { label: '人体工学椅', value: 'product-5', sku: 'CHR-ERG-01', unitPrice: 1899 }
  ]
}

export interface OrderMutationSuccess {
  success: true
  data: OrderDetail
}

export interface OrderMutationFailure {
  success: false
  message: string
  fieldErrors: OrderFieldError[]
}

export type OrderMutationResult = OrderMutationSuccess | OrderMutationFailure

let orderSequence = 1000
let orderStore = createSeedOrders()

export function queryMockOrders(params: OrderPageQuery): OrderPageResult {
  const filtered = orderStore.filter(order => {
    if (params.orderNo && !order.orderNo.includes(params.orderNo)) return false
    if (params.customerName && !order.customer.name.includes(params.customerName)) return false
    if (params.owner && order.owner !== params.owner) return false
    if (params.status && order.status !== params.status) return false
    const createdDate = order.createdAt.slice(0, 10)
    if (params.createdFrom && createdDate < params.createdFrom) return false
    if (params.createdTo && createdDate > params.createdTo) return false
    return true
  })
  const current = Math.max(1, params.current || 1)
  const pageSize = Math.max(1, params.pageSize || 10)
  const start = (current - 1) * pageSize
  return {
    data: filtered.slice(start, start + pageSize).map(toOrderRecord),
    total: filtered.length,
    success: true
  }
}

export function getMockOrder(id: string) {
  const order = orderStore.find(item => item.id === id)
  return order ? clone(order) : undefined
}

export function createMockOrder(model: OrderFormModel): OrderMutationResult {
  const errors = validateOrder(model)
  if (errors.length) return { success: false, message: '订单数据校验失败', fieldErrors: errors }

  const now = formatDateTime(new Date())
  const order = buildOrderDetail(model, {
    id: `order-${++orderSequence}`,
    orderNo: `SO-2026-${String(orderSequence).padStart(5, '0')}`,
    createdAt: now,
    updatedAt: now
  })
  orderStore = [order, ...orderStore]
  return { success: true, data: clone(order) }
}

export function updateMockOrder(
  id: string,
  model: OrderFormModel
): OrderMutationResult | undefined {
  const current = orderStore.find(item => item.id === id)
  if (!current) return undefined
  const errors = validateOrder(model)
  if (errors.length) return { success: false, message: '订单数据校验失败', fieldErrors: errors }

  const updated = buildOrderDetail(model, {
    id,
    orderNo: current.orderNo,
    createdAt: current.createdAt,
    updatedAt: formatDateTime(new Date())
  })
  orderStore = orderStore.map(item => (item.id === id ? updated : item))
  return { success: true, data: clone(updated) }
}

export function deleteMockOrder(id: string) {
  const before = orderStore.length
  orderStore = orderStore.filter(item => item.id !== id)
  return before !== orderStore.length
}

export function batchDeleteMockOrders(ids: string[]) {
  const idSet = new Set(ids)
  const before = orderStore.length
  orderStore = orderStore.filter(item => !idSet.has(item.id))
  return before - orderStore.length
}

function createSeedOrders(): OrderDetail[] {
  const statuses: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled']
  const priorities: OrderPriority[] = ['normal', 'high', 'urgent']
  return Array.from({ length: 48 }, (_, index) => {
    const customer = resolveCustomer(orderMeta.customers[index % 4].value)
    const productCount = (index % 3) + 1
    const items = Array.from({ length: productCount }, (_, itemIndex) =>
      createOrderItem(orderMeta.products[(index + itemIndex) % orderMeta.products.length], {
        id: `seed-item-${index + 1}-${itemIndex + 1}`,
        quantity: (itemIndex % 3) + 1,
        discountRate: itemIndex === 1 ? 5 : 0
      })
    )
    const status = statuses[index % statuses.length]
    const createdDate = new Date(2026, 6, (index % 10) + 1, 9 + (index % 8), 30)
    return {
      id: `order-${index + 1}`,
      orderNo: `SO-2026-${String(index + 1).padStart(5, '0')}`,
      customer,
      owner: orderMeta.owners[index % orderMeta.owners.length].value,
      status,
      priority: priorities[index % priorities.length],
      itemCount: items.length,
      amount: getOrderAmount(items),
      progress: getStatusProgress(status),
      expectedDeliveryDate: `2026-08-${String((index % 20) + 1).padStart(2, '0')}`,
      shippingAddress: `${['上海市浦东新区', '北京市海淀区', '深圳市南山区', '杭州市余杭区'][index % 4]}示例路 ${index + 1} 号`,
      remark: index % 3 === 0 ? '请在工作日送达，并提前联系收货人。' : '',
      items,
      createdAt: formatDateTime(createdDate),
      updatedAt: formatDateTime(new Date(createdDate.getTime() + 86400000))
    }
  }).reverse()
}

function validateOrder(model: OrderFormModel): OrderFieldError[] {
  const errors: OrderFieldError[] = []
  if (!model.customerId) errors.push({ name: 'customerId', errors: '请选择客户' })
  if (model.customerId === 'customer-risk') {
    errors.push({ name: 'customerId', errors: '该客户存在未处理争议，暂时不能创建订单' })
  }
  if (!model.owner) errors.push({ name: 'owner', errors: '请选择负责人' })
  if (!model.expectedDeliveryDate) {
    errors.push({ name: 'expectedDeliveryDate', errors: '请选择预计交付日期' })
  }
  if (!model.shippingAddress?.trim()) {
    errors.push({ name: 'shippingAddress', errors: '请输入收货地址' })
  }
  if (!model.items?.length) errors.push({ name: 'items', errors: '至少添加一条订单明细' })
  if (model.items?.some(item => !item.productId || item.quantity <= 0 || item.unitPrice < 0)) {
    errors.push({ name: 'items', errors: '订单明细存在未填写或不合法的数据' })
  }
  return errors
}

function buildOrderDetail(
  model: OrderFormModel,
  identity: Pick<OrderDetail, 'id' | 'orderNo' | 'createdAt' | 'updatedAt'>
): OrderDetail {
  const items = model.items.map((item, index) => {
    const product = resolveProduct(item.productId)
    return createOrderItem(product, {
      ...item,
      id: item.id || `${identity.id}-item-${index + 1}`
    })
  })
  return {
    ...identity,
    customer: resolveCustomer(model.customerId),
    owner: model.owner,
    status: model.status,
    priority: model.priority,
    itemCount: items.length,
    amount: getOrderAmount(items),
    progress: getStatusProgress(model.status),
    expectedDeliveryDate: model.expectedDeliveryDate,
    shippingAddress: model.shippingAddress,
    remark: model.remark,
    items
  }
}

function createOrderItem(
  product: OrderProductOption,
  input: Partial<OrderItem> & Pick<OrderItem, 'id'>
): OrderItem {
  const quantity = Number(input.quantity ?? 1)
  const unitPrice = Number(input.unitPrice ?? product.unitPrice)
  const discountRate = Number(input.discountRate ?? 0)
  return {
    id: input.id,
    productId: product.value,
    productName: product.label,
    sku: product.sku,
    quantity,
    unitPrice,
    discountRate,
    lineAmount: roundMoney(quantity * unitPrice * (1 - discountRate / 100))
  }
}

function resolveCustomer(id: string): OrderCustomer {
  const option = orderMeta.customers.find(item => item.value === id) ?? orderMeta.customers[0]
  return {
    id: option.value,
    name: option.label,
    contact: option.contact,
    phone: option.phone
  }
}

function resolveProduct(id: string) {
  return orderMeta.products.find(item => item.value === id) ?? orderMeta.products[0]
}

function getOrderAmount(items: OrderItem[]) {
  return roundMoney(items.reduce((total, item) => total + item.lineAmount, 0))
}

function getStatusProgress(status: OrderStatus) {
  return { pending: 15, processing: 60, completed: 100, cancelled: 0 }[status]
}

function toOrderRecord(order: OrderDetail): OrderRecord {
  const { shippingAddress: _shippingAddress, remark: _remark, items: _items, ...record } = order
  return clone(record)
}

function roundMoney(value: number) {
  return Number(value.toFixed(2))
}

function formatDateTime(value: Date) {
  const pad = (number: number) => String(number).padStart(2, '0')
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
