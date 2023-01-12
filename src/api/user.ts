import { mockService, Result } from '@/service'

import type { UserModel } from '../../mock/user'

export function login(data: Record<string, any>) {
  return mockService.request<Result<UserModel>>({
    url: '/login',
    method: 'post',
    data
  })
}
