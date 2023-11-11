import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'
import { getTypes } from '../utils'
import http from './http'

const apiEndpoint = `${process.env.APP_AUTH_SERVER_API}/login`

function loginWithJwt(jwt: string, expires = 7) {
  Cookies.set(process.env.APP_STORAGE as string, jwt, { expires })
  return jwt
}

async function login(loginType: any, fields: any) {
  try {
    const result = await http.post(apiEndpoint + loginType, fields)
    if (result) return { data: loginWithJwt(result.data) }
    return { error: 'Something went wrong.' }
  } catch (err) {
    console.error((err as any).message)
    return { error: (err as any).response?.data || err }
  }
}

async function userLogin(fields: any) {
  return login('/user', fields)
}

function logout(redirect = true) {
  Cookies.remove(process.env.APP_STORAGE as string)
  if (redirect) location.replace('/login')
}

function getAuthKey() {
  return Cookies.get(process.env.APP_STORAGE as string)
}

function getCurrentUser() {
  try {
    const jwt = getAuthKey()
    return jwt ? jwtDecode(jwt) : {}
  } catch (err) {
    logout()
    return {}
  }
}

const authAPI = {
  logout,
  getCurrentUser,
  loginWithJwt,
  getAuthKey,
  userLogin,
}

const IAuthAPI = getTypes(authAPI)
export type IAuthAPI = keyof typeof IAuthAPI

export default authAPI
