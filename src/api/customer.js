/**
 * 客户管理接口
 */

import axios from 'axios'
import { paramsify, signify, timestamp, sid } from './utils'
import { CONFIG } from './config'

export function getAllMasterCustomer (params) {
  const url = `${CONFIG.HOST}/getAllMasterCustomer`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getMasterCustomerDetail (params) {
  const url = `${CONFIG.HOST}/getMasterCustomerDetail`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function deleteMasterCustomer (params) {
  const url = `${CONFIG.HOST}/deleteMasterCustomer`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function addMasterCustomer (params) {
  const url = `${CONFIG.HOST}/addMasterCustomer`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getAllSaleList (params) {
  const url = `${CONFIG.HOST}/getAllSaleList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function deleteCustomerContact (params) {
  const url = `${CONFIG.HOST}/deleteCustomerContact`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function updateMasterCustomer (params) {
  const url = `${CONFIG.HOST}/updateMasterCustomer`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}
