import axios from 'axios'
import { paramsify, signify, timestamp, sid } from './utils'
import { CONFIG } from './config'

export function uploadPicture (params, file) {
  const url = `${CONFIG.HOST}/uploadPicture`
  const ts = timestamp()
  const data = new FormData()
  data.append('sid', sid())
  data.append('timestamp', ts)
  data.append('params', paramsify(params))
  data.append('multipartFile', file)
  data.append('sign', signify(params, ts))
  const config = {
    headers: {'Content-Type': 'multipart/form-data'}
  }
  return axios.post(url, data, config)
}

export function getPicture (params) {
  const url = `${CONFIG.HOST}/getPicture`
  const data = {
    params: paramsify(params),
    sign: signify(params)
  }
  return axios.get(url, {params: data})
}

export function deletePicture (params) {
  const url = `${CONFIG.HOST}/deletePicture`
  const ts = timestamp()
  const data = {
    sid: sid(),
    timestamp: ts,
    params: paramsify(params),
    sign: signify(params, ts)
  }
  return axios.get(url, {params: data})
}
