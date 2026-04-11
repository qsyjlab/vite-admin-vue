import { allPermissionStringKeys } from './permission'

export interface UserModel {
  userId: number
  username: string
  realName: string
  desc: string
  password: string
  token: string
  roles: Array<{
    roleName: string
    value: string
  }>
  permissions: string[]
}

export const userList: UserModel[] = [
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
