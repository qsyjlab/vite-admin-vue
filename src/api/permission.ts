import { mockService } from '@/service'
import { RouteModule } from '~/mock/permission'
import { Result } from '@/service/types/result'

export function getMenuList() {
  return mockService.request<Result<RouteModule>>({
    url: '/getMenuList',
    method: 'get'
  })
}
