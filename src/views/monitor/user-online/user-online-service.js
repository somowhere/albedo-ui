import request from '@/utils/request'
import qs from 'qs'

export function page(params) {
  return request({
    url: '/sys/user-online/?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function batchForceLogout(ids) {
  return request({
    url: '/sys/user-online',
    method: 'delete',
    data: ids
  })
}

export default { page, batchForceLogout }
