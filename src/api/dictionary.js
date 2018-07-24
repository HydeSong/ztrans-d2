import axios from 'axios'
import { paramsify, signify, timestamp, sid } from './utils'
import { CONFIG } from './config'

export function getActiveStatus (params) {
  const url = `${CONFIG.HOST}/getActiveStatus`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getCheckStatus (params) {
  const url = `${CONFIG.HOST}/getCheckStatus`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getCustomerCaclulateType (params) {
  const url = `${CONFIG.HOST}/getCustomerCaclulateType`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getCustomerJob (params) {
  const url = `${CONFIG.HOST}/getCustomerJob`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getCustomerLevel (params) {
  const url = `${CONFIG.HOST}/getCustomerLevel`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getCustomerOrderLevel (params) {
  const url = `${CONFIG.HOST}/getCustomerOrderLevel`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getCustomerSex (params) {
  const url = `${CONFIG.HOST}/getCustomerSex`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getCustomerSource (params) {
  const url = `${CONFIG.HOST}/getCustomerSource`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getCustomerType (params) {
  const url = `${CONFIG.HOST}/getCustomerType`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getOperateStatus (params) {
  const url = `${CONFIG.HOST}/getOperateStatus`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getAllCity (params) {
  const url = `${CONFIG.HOST}/getAllCity`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getAllCityArea (params) {
  const url = `${CONFIG.HOST}/getAllCityArea`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getAllPrv (params) {
  const url = `${CONFIG.HOST}/getAllPrv`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getAllTown (params) {
  const url = `${CONFIG.HOST}/getAllTown`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}
