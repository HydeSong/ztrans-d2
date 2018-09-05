/**
 * 车辆管理接口
 */

import axios from 'axios'
import { paramsify, signify, timestamp, sid } from './utils'
import { CONFIG } from './config'

export function getAllCar (params) {
  const url = `${CONFIG.HOST}/getAllCar`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function deleteCar (params) {
  const url = `${CONFIG.HOST}/deleteCar`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getMotorcadeList (params) {
  const url = `${CONFIG.HOST}/getMotorcadeList`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function addCar (params) {
  const url = `${CONFIG.HOST}/addCar`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function updateCar (params) {
  const url = `${CONFIG.HOST}/updateCar`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getAllCarBand (params) {
  const url = `${CONFIG.HOST}/getAllCarBand`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getAllCarColour (params) {
  const url = `${CONFIG.HOST}/getAllCarColour`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getAllCarType (params) {
  const url = `${CONFIG.HOST}/getAllCarType`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getCarDetail (params) {
  const url = `${CONFIG.HOST}/getCarDetail`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }

  return axios.get(url, {params: data})
}

export function getCarWeightList (params) {
  const url = `${CONFIG.HOST}/getCarWeightList`
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
