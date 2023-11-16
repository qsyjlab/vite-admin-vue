// import type { MockMethod } from 'vite-plugin-mock'

import { MockPluginMethod as MockMethod, resultError, resultSuccess } from './_utils'
import { allRouteModules, allPermissionStringKeys } from './permission'

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
    ],
    permissions: allPermissionStringKeys
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
    ],
    permissions: [
      'Welcome',
      'WelcomeIndex',
      'Dashboard',
      'DashboardIndex',
      'Components',
      'ProTable',
      'ProTableBasic'
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
    response: () => {
      // const { body } = response
      // const { username, password } = body as any

      // const _user = userList.find(item => item.password === password && item.username === username)

      // if (!_user) return resultError('Incorrect account or password')

      return resultSuccess(allRouteModules)
    }
  },
  {
    url: '/basic-api/mockList',
    method: 'get',
    response: response => {
      const { query } = response

      const { page = 1, pageSize = 10 } = query
      return resultSuccess({
        total: 1000,
        data: Array(Number(pageSize))
          .fill(0)
          .map((item, index) => ({
            id: (page - 1) * pageSize + (index + 1),
            name: 'name:' + ((page - 1) * pageSize + (index + 1)),
            status: ['all', 'open', 'closed', 'processing'][Math.floor(Math.random() * 4)],
            fnE: ['all', 'open', 'closed', 'processing'][Math.floor(Math.random() * 4)],
            imageSrc: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
            progress: Number((Math.random() * 100).toFixed(2))
          }))
      })
    }
  },
  {
    url: '/basic-api/refreshToken',
    method: 'get',
    response: () => {
      return resultSuccess({
        refreshToken: new Date().getTime()
      })
    }
  },
  {
    url: '/basic-api/uauth',
    method: 'get',
    response: () => {
      return resultSuccess(null)
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
  permissions: string[]
}

export default user
