import { localhostService as service } from '@/service'

export function login(data: Record<string, any>) {
  return service.request({
    url: '/login',
    method: 'post',
    data
  })
}
