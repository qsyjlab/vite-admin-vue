import { http, HttpResponse } from 'msw'

import {
  findMockUser,
  findMockUserByToken,
  findMockUserByUsername,
  getBackendMenusByUsername,
  toLoginResponse
} from '../data/auth'
import {
  batchDeleteMockOrders,
  createMockOrder,
  deleteMockOrder,
  getMockOrder,
  orderMeta,
  queryMockOrders,
  updateMockOrder
} from '../data/order'
import { success, failure } from './utils'

import type { OrderFormModel } from '../../api/order-types'

// mock 接口前缀，与 service/index.ts 的 basicApiService.baseURL 一致
const BASE = import.meta.env.VITE_APP_MOCK_API_BASE_URL || '/basic-api'

// ─── 认证相关 ──────────────────────────────────────────────────────────────

// POST /login —— 登录
const loginHandler = http.post(`${BASE}/login`, async ({ request }) => {
  const body = (await request.json()) as Record<string, string>
  const user = findMockUser(String(body.username || ''), String(body.password || ''))
  return user
    ? HttpResponse.json(success(toLoginResponse(user)))
    : HttpResponse.json(failure('账号或密码错误'))
})

// POST /sso —— 单点登录
const ssoHandler = http.post(`${BASE}/sso`, async ({ request }) => {
  const body = (await request.json()) as Record<string, string>
  return HttpResponse.json(
    body.ticket
      ? success(toLoginResponse(findMockUserByUsername('admin')!))
      : failure('SSO ticket 无效')
  )
})

// GET /uauth —— 获取当前用户信息（通过 token）
const uauthHandler = http.get(`${BASE}/uauth`, ({ request }) => {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  const user = findMockUserByToken(token)
  return HttpResponse.json(user ? success(toLoginResponse(user)) : failure('未登录', 401), {
    status: user ? 200 : 401
  })
})

// GET /refreshToken —— 刷新 token
const refreshTokenHandler = http.get(`${BASE}/refreshToken`, () =>
  HttpResponse.json(success({ refreshToken: Date.now() }))
)

// ─── 菜单相关 ──────────────────────────────────────────────────────────────

// GET /getMenuList —— 后端菜单映射模式 (BACKED) 使用
const getMenuListHandler = http.get(`${BASE}/getMenuList`, ({ request }) => {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  const user = findMockUserByToken(token)
  const username = user?.username || 'admin'
  const menus = getBackendMenusByUsername(username)
  return HttpResponse.json(success(menus))
})

// ─── 订单相关 ──────────────────────────────────────────────────────────────

// GET /orders/meta —— 表单元数据
const getOrderMetaHandler = http.get(`${BASE}/orders/meta`, () =>
  HttpResponse.json(success(orderMeta))
)

// GET /orders —— 列表查询
const listOrdersHandler = http.get(`${BASE}/orders`, ({ request }) => {
  const url = new URL(request.url)
  return HttpResponse.json(
    success(
      queryMockOrders({
        current: Number(url.searchParams.get('current') || 1),
        pageSize: Number(url.searchParams.get('pageSize') || 10),
        orderNo: url.searchParams.get('orderNo') || undefined,
        customerName: url.searchParams.get('customerName') || undefined,
        owner: url.searchParams.get('owner') || undefined,
        status: (url.searchParams.get('status') || undefined) as never,
        createdFrom: url.searchParams.get('createdFrom') || undefined,
        createdTo: url.searchParams.get('createdTo') || undefined
      })
    )
  )
})

// POST /orders —— 创建订单
const createOrderHandler = http.post(`${BASE}/orders`, async ({ request }) => {
  const result = createMockOrder((await request.json()) as unknown as OrderFormModel)
  return HttpResponse.json(
    result.success
      ? success(result.data, '订单创建成功')
      : failure(result.message, 422, { fieldErrors: result.fieldErrors }),
    { status: result.success ? 200 : 422 }
  )
})

// POST /orders/batch-delete —— 批量删除
const batchDeleteOrdersHandler = http.post(`${BASE}/orders/batch-delete`, async ({ request }) => {
  const body = (await request.json()) as { ids?: unknown[] }
  const ids = Array.isArray(body.ids) ? body.ids.map(String) : []
  return HttpResponse.json(success({ deleted: batchDeleteMockOrders(ids) }))
})

// GET /orders/:id —— 查询单条
const getOrderHandler = http.get(`${BASE}/orders/:id`, ({ params }) => {
  const id = decodeURIComponent(String(params.id))
  const order = getMockOrder(id)
  return order
    ? HttpResponse.json(success(order))
    : HttpResponse.json(failure(`订单不存在：${id}`, 404), { status: 404 })
})

// PUT /orders/:id —— 更新单条
const updateOrderHandler = http.put(`${BASE}/orders/:id`, async ({ request, params }) => {
  const id = decodeURIComponent(String(params.id))
  const result = updateMockOrder(id, (await request.json()) as unknown as OrderFormModel)
  if (!result) return HttpResponse.json(failure(`订单不存在：${id}`, 404), { status: 404 })
  return HttpResponse.json(
    result.success
      ? success(result.data, '订单更新成功')
      : failure(result.message, 422, { fieldErrors: result.fieldErrors }),
    { status: result.success ? 200 : 422 }
  )
})

// DELETE /orders/:id —— 删除单条
const deleteOrderHandler = http.delete(`${BASE}/orders/:id`, ({ params }) => {
  const id = decodeURIComponent(String(params.id))
  const deleted = deleteMockOrder(id)
  return deleted
    ? HttpResponse.json(success({ deleted: true }))
    : HttpResponse.json(failure(`订单不存在：${id}`, 404), { status: 404 })
})

// ─── 杂项 ──────────────────────────────────────────────────────────────────

function createMockRows(page: number, pageSize: number) {
  return Array.from({ length: pageSize }, (_, index) => ({
    id: (page - 1) * pageSize + index + 1,
    name: `name:${(page - 1) * pageSize + index + 1}`,
    status: ['all', 'open', 'closed', 'processing'][Math.floor(Math.random() * 4)],
    fnE: ['all', 'open', 'closed', 'processing'][Math.floor(Math.random() * 4)],
    imageSrc: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    progress: Number((Math.random() * 100).toFixed(2))
  }))
}

// GET /mockList
const mockListHandler = http.get(`${BASE}/mockList`, ({ request }) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page') || 1)
  const pageSize = Number(url.searchParams.get('pageSize') || 10)
  return HttpResponse.json(success({ total: 1000, data: createMockRows(page, pageSize) }))
})

// GET /todos
const todosHandler = http.get(`${BASE}/todos`, ({ request }) => {
  const url = new URL(request.url)
  const limit = Number(url.searchParams.get('limit') || 10)
  const todos = Array.from({ length: limit }, (_, index) => ({
    userId: 1,
    id: index + 1,
    title: `todo-${index + 1}`,
    completed: index % 2 === 0
  }))
  return HttpResponse.json(success(todos))
})

// ─── 处理器注册 ─────────────────────────────────────────────────────────────

export const handlers = [
  // 认证
  loginHandler,
  ssoHandler,
  uauthHandler,
  refreshTokenHandler,
  // 菜单
  getMenuListHandler,
  // 订单
  getOrderMetaHandler,
  listOrdersHandler,
  createOrderHandler,
  batchDeleteOrdersHandler,
  getOrderHandler,
  updateOrderHandler,
  deleteOrderHandler,
  // 杂项
  mockListHandler,
  todosHandler
]
