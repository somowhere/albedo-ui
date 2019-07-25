
import request from '@/router/axios'

export function pageGenScheme(query) {
  return request({
    url: '/codegen/scheme/',
    method: 'get',
    params: query
  })
}

export function saveGenScheme(obj) {
  return request({
    url: '/codegen/scheme/',
    method: 'post',
    data: obj
  })
}

export function genMenu(obj) {
  return request({
    url: '/codegen/scheme/gen-menu',
    method: 'post',
    data: obj
  })
}

export function genCode(obj) {
  return request({
    url: '/codegen/scheme/gen-code',
    method: 'put',
    data: obj
  })
}


export function findGenScheme(query) {
  return request({
    url: '/codegen/scheme/formData',
    method: 'get',
    params: query
  })
}

export function removeGenScheme(id) {
  return request({
    url: '/codegen/scheme/' + id,
    method: 'delete'
  })
}


