import AxiosRequest from './axios-request'
import { BaseAxiosRequestConfig } from './interface'

export { default as AxiosRequest } from './axios-request'

export * from './http-enum'
export * from './interface'

export const createAxiosRequest = (config: BaseAxiosRequestConfig) => new AxiosRequest(config)
