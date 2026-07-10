import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

import { allRouteModules } from '../../../src/mocks/data/permission'
import { userList } from '../../../src/mocks/data/user'

function sendJson(response: ServerResponse, data: unknown, statusCode = 200) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.end(JSON.stringify(data))
}

function success(data: unknown, message = '') {
  return { code: 200, data, message }
}

function failure(message: string, code = 0) {
  return { code, data: null, message }
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

        sendJson(response, failure(`Mock API not found: ${method} ${route}`, 404), 404)
      })
    }
  }
}
