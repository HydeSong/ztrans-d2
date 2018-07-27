/**
 * 报价接口
 */

import axios from 'axios'
import { paramsify, signify, timestamp, sid } from './utils'
import { CONFIG } from './config'

export function getAllRouterPriceByRouterId (params) {
  const url = `${CONFIG.HOST}/getAllRouterPriceByRouterId`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getAllRouterCustomerPrice (params) {
  const url = `${CONFIG.HOST}/getAllRouterCustomerPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function deleteRouterPrice (params) {
  const url = `${CONFIG.HOST}/deleteRouterPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}
