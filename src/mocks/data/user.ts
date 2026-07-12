/**
 * @deprecated 请使用 @/mocks/data/auth 中的 mockUsers 和 MockUser
 *
 * 此文件仅为向后兼容保留，重新导出 auth 模块的类型和数据
 */
export type { MockUser as UserModel, MockRole } from './auth'
export { mockUsers as userList, findMockUser, toLoginResponse } from './auth'
