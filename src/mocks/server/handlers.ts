import type { IncomingMessage, ServerResponse } from 'node:http'

import {
  findMockUser,
  findMockUserByToken,
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
import { sendJson, success, failure, readJsonBody } from './utils'

import type { OrderFormModel } from '@/api/order-types'

interface MockRouteContext {
  url: URL
  method: string
  route: string
  request: IncomingMessage
  response: ServerResponse
}

type MockHandler = (ctx: MockRouteContext) => Promise<boolean | void>

// ─── 认证相关 ──────────────────────────────────────────────────────────────

const authHandlers: MockHandler = async ({ route, method, request, response }) => {
  // POST /login —— 登录
  if (method === 'POST' && route === '/login') {
    const body = await readJsonBody(request)
    const user = findMockUser(String(body.username || ''), String(body.password || ''))
    if (user) {
      sendJson(response, success(toLoginResponse(user)))
    } else {
      sendJson(response, failure('账号或密码错误'))
    }
    return true
  }

  // POST /sso —— 单点登录
  if (method === 'POST' && route === '/sso') {
    const body = await readJsonBody(request)
    sendJson(
      response,
      body.ticket ? success(toLoginResponse(findMockUser('admin')!)) : failure('SSO ticket 无效')
    )
    return true
  }

  // GET /uauth —— 获取当前用户信息（通过 token）
  if (method === 'GET' && route === '/uauth') {
    const authHeader = request.headers.authorization || ''
    const token = authHeader.replace(/^Bearer\s+/i, '')
    const user = findMockUserByToken(token)
    sendJson(response, user ? success(toLoginResponse(user)) : failure('未登录', 401))
    return true
  }

  // GET /refreshToken —— 刷新 token
  if (method === 'GET' && route === '/refreshToken') {
    sendJson(response, success({ refreshToken: Date.now() }))
    return true
  }

  return false
}

// ─── 菜单相关 ──────────────────────────────────────────────────────────────

const menuHandlers: MockHandler = async ({ route, method, request, response }) => {
  // GET /getMenuList —— 后端菜单映射模式 (BACKED) 使用
  if (method === 'GET' && route === '/getMenuList') {
    const authHeader = request.headers.authorization || ''
    const token = authHeader.replace(/^Bearer\s+/i, '')
    const user = findMockUserByToken(token)
    const username = user?.username || 'admin'
    const menus = getBackendMenusByUsername(username)
    sendJson(response, success(menus))
    return true
  }

  return false
}

// ─── 订单相关 ──────────────────────────────────────────────────────────────

const orderHandlers: MockHandler = async ({ route, method, request, response, url }) => {
  // GET /orders/meta —— 表单元数据
  if (method === 'GET' && route === '/orders/meta') {
    sendJson(response, success(orderMeta))
    return true
  }

  // GET /orders —— 列表查询
  if (method === 'GET' && route === '/orders') {
    sendJson(
      response,
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
    return true
  }

  // POST /orders —— 创建订单
  if (method === 'POST' && route === '/orders') {
    const result = createMockOrder((await readJsonBody(request)) as unknown as OrderFormModel)
    sendJson(
      response,
      result.success
        ? success(result.data, '订单创建成功')
        : failure(result.message, 422, { fieldErrors: result.fieldErrors })
    )
    return true
  }

  // POST /orders/batch-delete —— 批量删除
  if (method === 'POST' && route === '/orders/batch-delete') {
    const body = await readJsonBody(request)
    const ids = Array.isArray(body.ids) ? body.ids.map(String) : []
    sendJson(response, success({ deleted: batchDeleteMockOrders(ids) }))
    return true
  }

  // /orders/:id —— 单条操作
  const orderRoute = route.match(/^\/orders\/([^/]+)$/)
  if (orderRoute) {
    const id = decodeURIComponent(orderRoute[1])

    if (method === 'GET') {
      const order = getMockOrder(id)
      sendJson(
        response,
        order ? success(order) : failure(`订单不存在：${id}`, 404),
        order ? 200 : 404
      )
      return true
    }

    if (method === 'PUT') {
      const result = updateMockOrder(id, (await readJsonBody(request)) as unknown as OrderFormModel)
      if (!result) {
        sendJson(response, failure(`订单不存在：${id}`, 404), 404)
        return true
      }
      sendJson(
        response,
        result.success
          ? success(result.data, '订单更新成功')
          : failure(result.message, 422, { fieldErrors: result.fieldErrors })
      )
      return true
    }

    if (method === 'DELETE') {
      const deleted = deleteMockOrder(id)
      sendJson(
        response,
        deleted ? success({ deleted: true }) : failure(`订单不存在：${id}`, 404),
        deleted ? 200 : 404
      )
      return true
    }
  }

  return false
}

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

const miscHandlers: MockHandler = async ({ route, method, response, url }) => {
  // GET /mockList
  if (method === 'GET' && route === '/mockList') {
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = Number(url.searchParams.get('pageSize') || 10)
    sendJson(response, success({ total: 1000, data: createMockRows(page, pageSize) }))
    return true
  }

  // GET /todos
  if (method === 'GET' && route === '/todos') {
    const limit = Number(url.searchParams.get('limit') || 10)
    const todos = Array.from({ length: limit }, (_, index) => ({
      userId: 1,
      id: index + 1,
      title: `todo-${index + 1}`,
      completed: index % 2 === 0
    }))
    sendJson(response, success(todos))
    return true
  }

  return false
}

// ─── 处理器注册 ─────────────────────────────────────────────────────────────

const allHandlers: MockHandler[] = [authHandlers, menuHandlers, orderHandlers, miscHandlers]

/**
 * 处理 mock API 请求，返回 true 表示已处理
 */
export async function handleMockRequest(ctx: MockRouteContext): Promise<boolean> {
  for (const handler of allHandlers) {
    const handled = await handler(ctx)
    if (handled) return true
  }
  return false
}

/**
 * 未匹配到任何 mock 路由时的兜底响应
 */
export function handleMockNotFound(response: ServerResponse, method: string, route: string) {
  sendJson(response, failure(`Mock API not found: ${method} ${route}`, 404), 404)
}
