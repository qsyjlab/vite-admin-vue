// import type { MockMethod } from 'vite-plugin-mock'

import { MockPluginMethod as MockMethod, resultError, resultSuccess } from './_utils'

const userList = [
  {
    userId: 1,
    username: 'admin',
    realName: 'admin',
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
    username: 'test',
    password: '123456',
    realName: 'test user',
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
    response: response => {
      const { body } = response
      const { username, password } = body as any

      const _user = userList.find(item => item.password === password && item.username === username)

      if (!_user) return resultError('Incorrect account or password')

      console.log('_user', _user)

      return resultSuccess(_user)
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
