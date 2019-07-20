
import request from '@/router/axios'

export function pageGenScheme(query) {
  return request({
    url: '/gen/genScheme/',
    method: 'get',
    params: query
  })
}

export function saveGenScheme(obj) {
  return request({
    url: '/gen/genScheme/',
    method: 'post',
    data: obj
  })
}
export function findGenScheme(query) {
  return request({
    url: '/gen/genScheme/formData',
    method: 'get',
    params: query
  })
}

export function removeGenScheme(id) {
  return request({
    url: '/gen/genScheme/' + id,
    method: 'delete'
  })
}


