import { mockService } from '@/service'
import type { RouteModule } from '~/mock/permission'

export function getMenuList() {
  return mockService.request<unknown, Api.Result<RouteModule>>({
    url: '/getMenuList',
    method: 'get'
  })
}
