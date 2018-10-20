/**
 * 客户管理接口
 */

import axios from 'axios'
import { paramsify, signify, timestamp, sid } from './utils'
import { CONFIG } from './config'



export function getMasterCustomerListBySearchKey (params) {
  const url = `${CONFIG.HOST}/getMasterCustomerListBySearchKey`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return axios.get(url, {params: data})

}


export function getAllRouterAlia (params) {
  const url = `${CONFIG.HOST}/getRouterAliaByCustomerMasterId`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return axios.get(url, {params: data})

}

export function getCustomerRouterDetail (params) {
  const url = `${CONFIG.HOST}/getCustomerRouterDetail`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return axios.get(url, {params: data})

}

export function getPriceAndCarByCustomerIdAndRouterSeries (params) {
  const url = `${CONFIG.HOST}/getPriceAndCarByCustomerIdAndRouterSeries`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return axios.get(url, {params: data})

}


export function createOrderByWeb (params) {
  const url = `${CONFIG.HOST}/createOrderByEmployee`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return axios.get(url, {params: data})

}
