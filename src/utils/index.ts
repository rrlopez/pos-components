/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable default-param-last */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import _, { debounce, get, identity, isEmpty, omitBy, pickBy, reduce, set, sortBy, uniqBy } from 'lodash'
import stringifyObject from 'stringify-object'
import { EVENTS, manifest } from './constants'

export function getTypes<V extends string | Object, T extends { [key in string]: V }>(o: T): T {
  return o
}

export function getDeepKeys(obj: any = {}) {
  let keys: any = []
  for (const key in obj) {
    keys.push(key)
    if (typeof obj[key] === 'object') {
      const subKeys = getDeepKeys(obj[key])
      keys = keys.concat(subKeys.map((subKey: any) => `${key}.${subKey}`))
    }
  }
  return keys
}

export function getLeafKeys(obj: any = {}) {
  let keys: any = []
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const subKeys = getLeafKeys(obj[key])
      keys = keys.concat(subKeys.map((subKey: any) => `${key}.${subKey}`))
    } else keys.push(key)
  }
  return keys
}

export const getFieldPaths = (data: any) => {
  const fieldPaths = [{ label: 'None', value: 'none' }]

  const getLabel = (item: any) => {
    const pieces = item.split(/[\s.]+/)
    let result = pieces[pieces.length - 1]
    result = pieces.length > 1 ? `${pieces[pieces.length - 2]}.${result}` : result
    return result
  }

  fieldPaths.push(
    ...getDeepKeys(data).map((item: any) => ({
      label: getLabel(item),
      value: item,
    })),
  )
  return fieldPaths
}

export const mapFieldToAbsolutePath = (data: any) => {
  const fieldPaths: any = {}

  getLeafKeys(data).forEach((item: any) => {
    fieldPaths[item] = get(data, item)
  })
  return fieldPaths
}

export function parseURLQuery(queryString: any = location.search) {
  const query: any = {}
  if (queryString.length > 0) {
    const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&')
    for (let i = 0; i < pairs.length; i += 1) {
      const pair = pairs[i].split('=')
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
    }
  }

  return query
}

export const updateURLQuery = (value = {}, urlQuery: any = undefined) => {
  urlQuery = urlQuery || parseURLQuery(location.search)
  const newValue = { ...urlQuery, ...value }
  Object.keys(newValue).forEach(key => {
    if (!(newValue[key] || newValue[key] === 0)) delete newValue[key]
  })
  const finalValue = Object.keys(newValue).reduce((t, i) => `${t}${i}=${newValue[i]}&`, `?`)
  return finalValue.substring(0, finalValue.length - 1)
}

export function isFunction(functionToCheck: any) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
}

export const fileToDataURL = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

export function fileToBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event: any) => {
      resolve(event.target.result)
    }

    reader.onerror = err => {
      reject(err)
    }

    reader.readAsDataURL(file)
  })
}

export function fileToBinary(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result: any = reader.result
      const binary = new Uint8Array(result)
      resolve(binary)
    }

    reader.onerror = err => {
      reject(err)
    }

    reader.readAsDataURL(file)
  })
}

export const bufferToDataURL = (buffer: any) => {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

export const generateBlogDetails = (html: any) => {
  const div: any = document.createElement('div')
  div.innerHTML = html
  const banner = div.querySelector('#card-image')?.src || div.querySelector('div img')?.src || ''
  const title = div.querySelector('#card-title')?.innerText || div.querySelector('div')?.textContent.split('\n')[0] || ''
  const description = div.querySelector('#card-description')?.innerText || div.querySelector('div p')?.textContent.split('\n')[0] || ''
  return { banner, title, description }
}

export const argsToString = (args: any, wrapper = (args: any) => args) => {
  if (args.conditions) {
    args.conditions = args.conditions.filter((condition: any) => condition?.value || condition?.values)
    args.conditions = uniqBy(args.conditions, 'key')
  }
  if (get(args, 'options.sort')) {
    args.options.sort = uniqBy(args.options.sort, 'key')
    args.options.sort = sortBy(args.options.sort, ['priority'], ['desc'])
    args.options.sort = args.options.sort.map((sort: any) => ({
      key: sort.key,
      value: sort.value,
    }))
  }

  Object.keys(args).forEach(key => {
    if (args[key] === undefined) {
      delete args[key]
    }
  })

  const parsed = stringifyObject(args, { singleQuotes: false })

  return wrapper(parsed.substring(1, parsed.length - 1))
}

export const purgeObj = (obj: any) => stringifyObject(omitBy(obj, isEmpty), { singleQuotes: false }).replaceAll('"##', '').replaceAll('##"', '')
export const purgeArgs = (obj: any) =>
  Object.entries(pickBy(obj, identity))
    .map(el => `${el[0]}: ${el[1]}`, [])
    .join(' ')

export const parseFields = (fields: any) =>
  stringifyObject(flattenObjToNestedObj(fields), { singleQuotes: false }).replaceAll(': {', '{').replaceAll(': true', '').replaceAll(',', '')

export const pause = async (delay: number) =>
  new Promise(resolve => {
    setTimeout(resolve, delay)
  })

export const getIntersectionObject = (array: any, excludeNull: any) => {
  const data = {}
  const keys = getLeafKeys(array[0])
  keys.forEach((key: any) => {
    const fields: any = new Set(array.map((item: any) => get(item, key)))
    if (fields.size < 2) {
      const value = fields.values().next().value ?? null
      if ((value === null || value === '') && excludeNull) return
      set(data, key, value)
    }
  })
  return data
}

export function flattenObjToNestedObj(obj: any) {
  return reduce(
    obj,
    (result, value, key) => {
      set(result, key, value)
      return result
    },
    {},
  )
}

export const timeout = (cb: any, delay: any) => {
  const timer = setTimeout(() => {
    cb()
    clearTimeout(timer)
  }, delay)
}

export function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

export const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

export const downloadFile = async (blob: Blob, filename: string) => {
  try {
    // Create a blob URL and initiate download
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    // Clean up the blob URL
    window.URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('Error downloading file', error)
    return false
  }
}

export const downloadCSV = async (response: any, defaultFilename = `${_.capitalize(manifest.websiteName)}-${new Date().toDateString()}.csv`) => {
  log('download response', response)
  const contentDisposition = response.headers['content-disposition'] || ''
  const match = contentDisposition.match(/filename="(.+)"/)
  const filename = match ? match[1] : defaultFilename
  return downloadFile(b64toBlob(response.data), filename)
}

export const downloadPDF = (response: any, defaultFilename = 'downloaded.pdf') => {
  log('download response', response)
  const contentDisposition = response.headers['content-disposition'] || ''
  const match = contentDisposition.match(/filename="(.+)"/)
  const filename = match ? match[1] : defaultFilename
  return downloadFile(response.data, filename)
}

export const onInteractApp = (cb: any, type = 'add') => {
  const appElement: any = document.getElementById('__next')
  EVENTS.forEach((e: any) => {
    appElement[`${type}EventListener`](e, cb, { once: true })
  })
}

const normalLog = (label: any, value: any, condition = () => true) => {
  if ((process.env.APP_ENV === 'development' || process.env.APP_DEBUG) && condition()) console.info(label, value)
}

const debounceLog = debounce(normalLog, 150)

export const log = (label: any, value?: any, options = {}) => {
  const { condition, debaunce }: any = options
  if (debaunce) debounceLog(label, value, condition)
  else normalLog(label, value, condition)
}

export const toPhoneFormat = (str: string) => {
  if (str.length > 14) return str.substring(0, 14)
  const digitsOnly = str.replace(/\D/g, '')

  if (digitsOnly.length <= 3) return digitsOnly
  else if (digitsOnly.length <= 6) return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
  else return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
}
