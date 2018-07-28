/**
 * 订单费用接口
 */

import axios from 'axios'
import { paramsify, signify, timestamp, sid } from './utils'
import { CONFIG } from './config'

export function getOrderPriceList (params) {
  const url = `${CONFIG.HOST}/getOrderPriceList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}
