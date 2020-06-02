import request from '@/utils/request'
import qs from 'qs'

export function page(params) {
  return request({
    url: '/sys/token/?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function del(ids) {
  return request({
    url: '/sys/token',
    method: 'delete',
    data: ids
  })
}

export default { page, del }
