import type { MockMethod } from 'vite-plugin-mock'

const user: MockMethod[] = [
  {
    url: '/basic-api/login',
    method: 'post',
    timeout: 200,
    response: (_this, opt) => {
      // console.log(_this, opt)

      return Promise.resolve({ data: 1 })
    }
    // rawResponse?: (this: RespThisType, req: IncomingMessage, res: ServerResponse) => void;
  },
  {
    url: '/basic-api/getUsers',
    method: 'get',
    timeout: 200,
    response: (_this, opt) => {
      // console.log(_this, opt)
    }
    // rawResponse?: (this: RespThisType, req: IncomingMessage, res: ServerResponse) => void;
  }
]

export default user
