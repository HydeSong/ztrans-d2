import axios from 'axios'
import { paramsify, signify, timestamp } from './utils'
import { CONFIG } from './config'

export function getAllEmployee (params) {
  const url = `${CONFIG.HOST}/getAllEmployee`
  const data = {
    timestamp: timestamp(),
    sid: params.sid,
    params: paramsify(params),
    sign: signify(params)
  }

  return axios.get(url, {params: data})
}
