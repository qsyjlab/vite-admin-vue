import { basicApiService } from '@/service'

import type { UserModel } from '@/mocks/data/user'

export function login(data: Record<string, any>) {
  return basicApiService.request<UserModel>({
    url: '/login',
    method: 'post',
    data
  })
}

export function getUauth() {
  return basicApiService.request<UserModel>({
    url: '/uauth',
    method: 'get'
  })
}

export function refreshToken() {
  return basicApiService.request({
    url: '/refreshToken',
    method: 'get'
  })
}

export function ssoLogin(data: Record<string, any>) {
  return basicApiService.request<UserModel>(
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
