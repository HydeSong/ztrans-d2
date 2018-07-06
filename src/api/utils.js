import { Base64 } from 'js-base64'
import MD5 from 'md5'
import { CONFIG } from './config'

export function paramsify (params) {
  return Base64.encode(JSON.stringify(params))
}

export function signify (params) {
  return MD5(`${CONFIG.appsecret}params${paramsify(params)}timestamp${timestamp()}${CONFIG.appsecret}`)
}

export function timestamp () {
  return new Date().getTime()
}
