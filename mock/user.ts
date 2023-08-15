// import type { MockMethod } from 'vite-plugin-mock'

import { MockPluginMethod as MockMethod, resultError, resultSuccess } from './_utils'
import { allRouteModules } from './permission'

const userList = [
  {
    userId: 1,
    username: 'admin',
    realName: '超级管理员',
    desc: 'manager',
    password: '123456',
    token: 'fakeToken1',
    roles: [
      {
        roleName: 'Super Admin',
        value: 'super'
      }
    ]
  },
  {
    userId: 2,
    username: 'testuser',
    password: '123456',
    realName: '权限测试账号',
    desc: 'tester',
    token: 'fakeToken2',
    roles: [
      {
        roleName: 'Tester',
        value: 'test'
      }
    ]
  }
]

const user: MockMethod[] = [
  {
    url: '/basic-api/login',
    method: 'post',
    timeout: 200,
    statusCode: 200,
    response: response => {
      const { body } = response
      const { username, password } = body as any

      const _user = userList.find(item => item.password === password && item.username === username)

      if (!_user) return resultError('Incorrect account or password')

      return resultSuccess(_user)
    }
  },
  {
    url: '/basic-api/getMenuList',
    method: 'get',
    timeout: 200,
    statusCode: 200,
    response: response => {
      // const { body } = response
      // const { username, password } = body as any

      // const _user = userList.find(item => item.password === password && item.username === username)

      // if (!_user) return resultError('Incorrect account or password')

      return resultSuccess(allRouteModules)
    }
  }
]

export interface UserModel {
  userId: number
  username: string
  realName: string
  desc: string
  password: string
  token: string
}

export default user
