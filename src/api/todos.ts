import { mockService } from '@/service'

export type Root = Root2[]

export interface Root2 {
  userId: number
  id: number
  title: string
  completed: boolean
}

export function getTodos(params: Record<string, any>) {
  return mockService.request<Root>({
    url: '/todos',
    params
  })
}
