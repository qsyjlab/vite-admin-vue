import { InjectionKey } from 'vue'
import { TableMethods } from '../types'

// 共享 table 实例到子集
export const tableActionKey: InjectionKey<TableMethods> = Symbol()
