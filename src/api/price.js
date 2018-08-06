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

export function deleteRouterByRouterId (params) {
  const url = `${CONFIG.HOST}/deleteRouterByRouterId`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function addRouterPrice (params) {
  const url = `${CONFIG.HOST}/addRouterPrice`
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

export function updateBatchRouterPrice (params) {
  const url = `${CONFIG.HOST}/updateBatchRouterPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getMasterCustomerList (params) {
  const url = `${CONFIG.HOST}/getMasterCustomerList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function deleteRouterCustomerPrice (params) {
  const url = `${CONFIG.HOST}/deleteRouterCustomerPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function addRouterCustomerPrice (params) {
  const url = `${CONFIG.HOST}/addRouterCustomerPrice`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}
