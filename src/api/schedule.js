import axios from 'axios'
import { paramsify, signify, timestamp } from './utils'
import { CONFIG } from './config'

export function getRouterAliaList (params) {
  const url = `${CONFIG.HOST}/getRouterAliaList`
  const data = {
    timestamp: timestamp(),
    customerNumId: params.customerNumId,
    params: paramsify(params),
    sign: signify(params)
  }

  return axios.get(url, {params: data})
}

export function getAllRouterAndEmployee (params) {
  const url = `${CONFIG.HOST}/getAllRouterAndEmployee`
  const data = {
    timestamp: timestamp(),
    sid: params.sid,
    params: paramsify(params),
    sign: signify(params)
  }

  return axios.get(url, {params: data})
}

export function deleteRouterAndEmployee (params) {
  const url = `${CONFIG.HOST}/deleteRouterAndEmployee`
  const data = {
    timestamp: timestamp(),
    sid: params.sid,
    params: paramsify(params),
    sign: signify(params)
  }

  return axios.get(url, {params: data})
}

export function addRouterToEmployee (params) {
  const url = `${CONFIG.HOST}/addRouterToEmployee`
  const data = {
    timestamp: timestamp(),
    sid: params.sid,
    params: paramsify(params),
    sign: signify(params)
  }

  return axios.get(url, {params: data})
}
