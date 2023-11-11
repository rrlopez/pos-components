import authAPI from './auth'
import http from './http'

export const getConfigs = (headers={}) => {
  const key = authAPI.getAuthKey()
  return {
    headers: {
      ...headers,
      'x-auth-token': key,
    },
  }
}

export const tryCatch = async (callback: any) => {
  try {
    const response = await callback()
    return response
  } catch (error: any) {
    const {data = {}} = error.response || {}
    let er = data.error || { ...error, message: data.message || error.message }
    if(typeof er === 'string') er = {message: er}
    return { data: undefined, error: er }
  }
}

const graphqlPost = async function (query: any, payload = {}) {
  return tryCatch(async () => {
    const result = await http.post(process.env.APP_GQL_SERVER_API as any, { query, payload: JSON.stringify(payload) }, getConfigs() as any)
    return result.data
  })
}

export const graphqlQuery = async function (queries: string) {
  const { data, error } = await graphqlPost(
    `query{
      ${queries}
    }`,
  )
  return { ...data, error }
}

export const graphqlMutation = async function (mutations: string) {
  const { data, error } = await graphqlPost(
    `mutation{
      ${mutations}
    }`,
  )
  return { ...data, error }
}

export default class Service {
  nodeAPIEndpoint = process.env.APP_NODE_SERVER_API as string
  phpAPIEndpoint = process.env.APP_PHP_SERVER_API as string
  integAPIEndpoint = process.env.APP_INTEG_SERVER_API as string

  async add(fields: any) {
    return tryCatch(async () => http.post(`${this.nodeAPIEndpoint}/add`, fields, getConfigs() as any))
  }

  async addOne(fields: any) {
    return tryCatch(async () => http.post(`${this.nodeAPIEndpoint}/addOne`, fields, getConfigs() as any))
  }

  async get(payload?: any) {
    return tryCatch(async () => http.post(`${this.nodeAPIEndpoint}/get`, payload, getConfigs() as any))
  }

  async getOne(id: any, payload?: any) {
    return tryCatch(async () => http.post(`${this.nodeAPIEndpoint}/get/${id}`, payload, getConfigs() as any))
  }

  async del(ids: any) {
    return tryCatch(async () => http.post(`${this.nodeAPIEndpoint}/del`, ids, getConfigs() as any))
  }

  async delOne(id: any) {
    return tryCatch(async () => http.delete(`${this.nodeAPIEndpoint}/${id}`, getConfigs() as any))
  }

  async update(id: any, fields: any, options: any) {
    return tryCatch(async () => http.put(`${this.nodeAPIEndpoint}/edit/${id}`, { fields, options }, getConfigs() as any))
  }

  async updateOne(id: any, fields: any, options?: any) {
    return tryCatch(async () => http.put(`${this.nodeAPIEndpoint}/${id}`, { fields, options }, getConfigs() as any))
  }

  async isExist(payload: any, isExcludeMe: any = false) {
    if (isExcludeMe) {
      const user = authAPI.getCurrentUser() as any
      payload = { id: { $ne: user.id }, ...payload }
    }
    return tryCatch(async () => http.post(`${this.nodeAPIEndpoint}/exist`, payload, getConfigs() as any))
  }

  async check(field: any, value: any) {
    const user = authAPI.getCurrentUser() as any
    const payload = { id: user.id, field, value }
    return tryCatch(async () => http.post(`${this.nodeAPIEndpoint}/check`, payload, getConfigs() as any))
  }
}
