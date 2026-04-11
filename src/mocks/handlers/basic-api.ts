import { delay, http } from 'msw'
import { allRouteModules } from '../data/permission'
import { userList } from '../data/user'
import { failure, success } from '../response'

function createMockRows(page: number, pageSize: number) {
  return Array(pageSize)
    .fill(0)
    .map((_, index) => ({
      id: (page - 1) * pageSize + (index + 1),
      name: `name:${(page - 1) * pageSize + (index + 1)}`,
      status: ['all', 'open', 'closed', 'processing'][Math.floor(Math.random() * 4)],
      fnE: ['all', 'open', 'closed', 'processing'][Math.floor(Math.random() * 4)],
      imageSrc: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
      progress: Number((Math.random() * 100).toFixed(2))
    }))
}

export const basicApiHandlers = [
  http.post('/basic-api/login', async ({ request }) => {
    await delay(200)
    const { username, password } = (await request.json()) as {
      username?: string
      password?: string
    }

    const user = userList.find(item => item.username === username && item.password === password)

    if (!user) {
      return failure('Incorrect account or password')
    }

    return success(user)
  }),

  http.get('/basic-api/getMenuList', async () => {
    await delay(200)
    return success(allRouteModules)
  }),

  http.post('/basic-api/sso', async ({ request }) => {
    await delay(200)
    const { ticket } = (await request.json()) as { ticket?: string }

    if (!ticket) {
      return failure('Incorrect sso')
    }

    return success(userList.find(item => item.username === 'admin') || null)
  }),

  http.get('/basic-api/mockList', async ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = Number(url.searchParams.get('pageSize') || 10)

    return success({
      total: 1000,
      data: createMockRows(page, pageSize)
    })
  }),

  http.get('/basic-api/refreshToken', async () => {
    return success({
      refreshToken: Date.now()
    })
  }),

  http.get('/basic-api/uauth', async () => {
    return success(null)
  }),

  http.get('/basic-api/todos', async ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') || 10)

    return success(
      Array(limit)
        .fill(0)
        .map((_, i) => ({
          userId: 1,
          id: i + 1,
          title: `todo-${i + 1}`,
          completed: i % 2 === 0
        }))
    )
  })
]
