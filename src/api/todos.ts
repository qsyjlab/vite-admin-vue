/*
 * @Description:
 * @Autor: qsyj
 * @Date: 2022-07-20 10:18:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 10:27:56
 */
import { baseService } from '@/service'

export type Root = Root2[]

export interface Root2 {
  userId: number
  id: number
  title: string
  completed: boolean
}

export function getTodos(params: Record<string, any>) {
  return baseService.request<Root>({
    url: '/todos',
    params
  })
}
