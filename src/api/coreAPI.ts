import service, { getConfigs, tryCatch } from '.'
import http from './http'

class CoreAPI extends service {
  nodeAPIEndpoint = `${this.nodeAPIEndpoint}/users` as any

  async forgotPassword(payload: any) {
    return tryCatch(async () => http.post(`${process.env.APP_AUTH_SERVER_API}/forgot`, payload, getConfigs() as any))
  }

  async resetPassword(payload: any) {
    return tryCatch(async () => http.post(`${process.env.APP_AUTH_SERVER_API}/reset`, payload, getConfigs() as any))
  }

  async checkAuth() {
    return http.get(`${process.env.APP_AUTH_SERVER_API}/ping`, getConfigs() as any)
  }

  async checkGQL() {
    return http.get(`${process.env.APP_GQL_SERVER_API}/ping`, getConfigs() as any)
  }
}
const coreAPI = new CoreAPI()
export default coreAPI
