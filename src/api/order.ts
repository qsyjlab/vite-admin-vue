import { basicApiService } from '@/service'
import type {
  OrderDetail,
  OrderFormModel,
  OrderMeta,
  OrderPageQuery,
  OrderPageResult
} from './order-types'

export function getOrderPage(params: OrderPageQuery) {
  return basicApiService
    .request<OrderPageResult>({ url: '/orders', method: 'get', params })
    .then(unwrapResult)
}

export function getOrderMeta() {
  return basicApiService
    .request<OrderMeta>({ url: '/orders/meta', method: 'get' })
    .then(unwrapResult)
}

export function getOrderDetail(id: string) {
  return basicApiService
    .request<OrderDetail>({ url: `/orders/${encodeURIComponent(id)}`, method: 'get' })
    .then(unwrapResult)
}

export function createOrder(data: OrderFormModel) {
  return basicApiService
    .request<OrderDetail>({ url: '/orders', method: 'post', data })
    .then(unwrapResult)
}

export function updateOrder(id: string, data: OrderFormModel) {
  return basicApiService
    .request<OrderDetail>({ url: `/orders/${encodeURIComponent(id)}`, method: 'put', data })
    .then(unwrapResult)
}

export function deleteOrder(id: string) {
  return basicApiService
    .request<{ deleted: boolean }>({
      url: `/orders/${encodeURIComponent(id)}`,
      method: 'delete'
    })
    .then(unwrapResult)
}

export function batchDeleteOrders(ids: string[]) {
  return basicApiService
    .request<{ deleted: number }>({ url: '/orders/batch-delete', method: 'post', data: { ids } })
    .then(unwrapResult)
}

function unwrapResult<T>(response: Api.Result<T>) {
  if (response.data === undefined) throw new Error(response.message || '接口未返回数据')
  return response.data
}

export * from './order-types'
