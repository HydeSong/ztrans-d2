// import request from '@/plugin/axios'
import axios from 'axios'

export function BusinessTable1List (data) {
  return axios.post({
    url: '/demo/business/table/1',
    method: 'post',
    data
  })
}
