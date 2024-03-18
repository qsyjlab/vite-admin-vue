import { mockService } from '@/service'

import type { UserModel } from '../../mock/user'

export function login(data: Record<string, any>) {
  return mockService.request<UserModel>({
    url: '/login',
    method: 'post',
    data
  })
}

export function getUauth() {
  return mockService.request<UserModel>({
    url: '/uauth',
    method: 'get'
  })
}

export function refreshToken() {
  return mockService.request({
    url: '/refreshToken',
    method: 'get'
  })
}

export function ssoLogin(data: Record<string, any>) {
  return mockService.request<UserModel>(
    {
      url: '/sso',
      method: 'post',
      data
    },
    {
      ignoreCancelRequest: true
    }
  )
}
