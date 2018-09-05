/**
 * 指派接口
 */

import axios from 'axios'
import { paramsify, signify, timestamp, sid } from './utils'
import { CONFIG } from './config'

export function getCarTypeList (params) {
  const url = `${CONFIG.HOST}/getCarTypeList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getOrderByCustomerNumId (params) {
  const url = `${CONFIG.HOST}/getOrderByCustomerNumId`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function selectDriver (params) {
  const url = `${CONFIG.HOST}/selectDriver`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function confirmDriver (params) {
  const url = `${CONFIG.HOST}/confirmDriver`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getDriverOrderDetail (params) {
  const url = `${CONFIG.HOST}/getDriverOrderDetail`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getUnDealOrderCount (params) {
  const url = `${CONFIG.HOST}/getUnDealOrderCount`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}
export function getCarSizeList (params) {
  const url = `${CONFIG.HOST}/getCarSizeList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}
