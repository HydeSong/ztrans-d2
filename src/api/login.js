import axios from 'axios'
import { paramsify, signify, signifyLogin, timestamp } from './utils'
import { CONFIG } from './config'

export function loginSystem (params) {
  const url = `${CONFIG.HOST}/loginSystem`
  const ts = timestamp()
  const data = {
    timestamp: ts,
    params: paramsify(params),
    sign: signifyLogin(params, ts)
  }

  return axios.get(url, {params: data})
}

export function cancelLoginSystem (params) {
  const url = `${CONFIG.HOST}/cancelLoginSystem`
  const ts = timestamp()
  const data = {
    timestamp: ts,
    sid: params.sid,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}
