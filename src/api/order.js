/**
 * 指派接口
 */

import axios from 'axios'
import { paramsify, signify, timestamp } from './utils'
import { CONFIG } from './config'

export function getCarTypeList (params) {
  const url = `${CONFIG.HOST}/getCarTypeList`
  const ts = timestamp()
  const data = {
    timestamp: ts,
    sid: params.sid,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}
