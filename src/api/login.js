import axios from 'axios'
import { paramsify, signify, timestamp } from './utils'
import { CONFIG } from './config'

export function loginSystem (params) {
  const url = `${CONFIG.HOST}/loginSystem`
  const data = {
    timestamp: timestamp(),
    params: paramsify(params),
    sign: signify(params)
  }

  return axios.get(url, {params: data})
}

export function cancelLoginSystem (params) {
  const url = `${CONFIG.HOST}/cancelLoginSystem`
  const data = {
    timestamp: timestamp(),
    sid: params.sid,
    params: paramsify(params),
    sign: signify(params)
  }

  console.log(data)

  return axios.get(url, {params: data})
}
