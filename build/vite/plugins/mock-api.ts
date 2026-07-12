import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

import { allRouteModules } from '../../../src/mocks/data/permission'
import {
  batchDeleteMockOrders,
  createMockOrder,
  deleteMockOrder,
  getMockOrder,
  orderMeta,
  queryMockOrders,
  updateMockOrder
} from '../../../src/mocks/data/order'
import { userList } from '../../../src/mocks/data/user'
import type { OrderFormModel } from '../../../src/api/order-types'

function sendJson(response: ServerResponse, data: unknown, statusCode = 200) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(data))
}

function success(data: unknown, message = '') {
  return { code: 200, data, message }
}

function failure(message: string, code = 0, data: unknown = null) {
  return { code, data, message }
}

async function readJsonBody(request: IncomingMessage) {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  if (!chunks.length) return {}

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>
  } catch {
    return {}
  }
}

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

export function mockApiPlugin(apiBaseUrl: string): Plugin {
  const normalizedPrefix = String(apiBaseUrl || '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
  const mockPrefix = normalizedPrefix ? `/${normalizedPrefix}` : ''

  return {
    name: 'vite-admin:mock-api',
    apply: 'serve',
    configureServer(server) {
      if (!mockPrefix) {
        server.config.logger.warn(
          '[vite:mock] VITE_APP_MOCK_API_BASE_URL is empty; mock API middleware is disabled.'
        )
        return
      }

      server.middlewares.use(async (request, response, next) => {
        if (!request.url) return next()

        const url = new URL(request.url, 'http://vite.local')
        if (url.pathname !== mockPrefix && !url.pathname.startsWith(`${mockPrefix}/`)) return next()

        const route = url.pathname.slice(mockPrefix.length)
        const method = request.method?.toUpperCase()

        if (method === 'POST' && route === '/login') {
          const body = await readJsonBody(request)
          const user = userList.find(
            item => item.username === body.username && item.password === body.password
          )
          sendJson(response, user ? success(user) : failure('Incorrect account or password'))
          return
        }

        if (method === 'GET' && route === '/getMenuList') {
          sendJson(response, success(allRouteModules))
          return
        }

        if (method === 'POST' && route === '/sso') {
          const body = await readJsonBody(request)
          sendJson(
            response,
            body.ticket
              ? success(userList.find(item => item.username === 'admin') || null)
              : failure('Incorrect sso')
          )
          return
        }

        if (method === 'GET' && route === '/mockList') {
          const page = Number(url.searchParams.get('page') || 1)
          const pageSize = Number(url.searchParams.get('pageSize') || 10)
          sendJson(response, success({ total: 1000, data: createMockRows(page, pageSize) }))
          return
        }

        if (method === 'GET' && route === '/refreshToken') {
          sendJson(response, success({ refreshToken: Date.now() }))
          return
        }

        if (method === 'GET' && route === '/uauth') {
          sendJson(response, success(null))
          return
        }

        if (method === 'GET' && route === '/todos') {
          const limit = Number(url.searchParams.get('limit') || 10)
          const todos = Array.from({ length: limit }, (_, index) => ({
            userId: 1,
            id: index + 1,
            title: `todo-${index + 1}`,
            completed: index % 2 === 0
          }))
          sendJson(response, success(todos))
          return
        }

        if (method === 'GET' && route === '/orders/meta') {
          sendJson(response, success(orderMeta))
          return
        }

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
          return
        }

        if (method === 'POST' && route === '/orders') {
          const result = createMockOrder((await readJsonBody(request)) as unknown as OrderFormModel)
          sendJson(
            response,
            result.success
              ? success(result.data, '订单创建成功')
              : failure(result.message, 422, { fieldErrors: result.fieldErrors })
          )
          return
        }

        if (method === 'POST' && route === '/orders/batch-delete') {
          const body = await readJsonBody(request)
          const ids = Array.isArray(body.ids) ? body.ids.map(String) : []
          sendJson(response, success({ deleted: batchDeleteMockOrders(ids) }))
          return
        }

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
            return
          }

          if (method === 'PUT') {
            const result = updateMockOrder(
              id,
              (await readJsonBody(request)) as unknown as OrderFormModel
            )
            if (!result) {
              sendJson(response, failure(`订单不存在：${id}`, 404), 404)
              return
            }
            sendJson(
              response,
              result.success
                ? success(result.data, '订单更新成功')
                : failure(result.message, 422, { fieldErrors: result.fieldErrors })
            )
            return
          }

          if (method === 'DELETE') {
            const deleted = deleteMockOrder(id)
            sendJson(
              response,
              deleted ? success({ deleted: true }) : failure(`订单不存在：${id}`, 404),
              deleted ? 200 : 404
            )
            return
          }
        }

        sendJson(response, failure(`Mock API not found: ${method} ${route}`, 404), 404)
      })
    }
  }
}
