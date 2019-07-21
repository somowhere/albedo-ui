
import request from '@/router/axios'

export function pageGenScheme(query) {
  return request({
    url: '/codegen/genScheme/',
    method: 'get',
    params: query
  })
}

export function saveGenScheme(obj) {
  return request({
    url: '/codegen/genScheme/',
    method: 'post',
    data: obj
  })
}
export function findGenScheme(query) {
  return request({
    url: '/codegen/genScheme/formData',
    method: 'get',
    params: query
  })
}

export function removeGenScheme(id) {
  return request({
    url: '/codegen/genScheme/' + id,
    method: 'delete'
  })
}


