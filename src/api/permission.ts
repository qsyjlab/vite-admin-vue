import { basicApiService } from '@/service'
import type { RouteModule } from '@/mocks/data/permission'

export function getMenuList() {
  return basicApiService.request<unknown, Api.Result<RouteModule>>({
    url: '/getMenuList',
    method: 'get'
  })
}
