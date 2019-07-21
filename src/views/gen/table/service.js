
import request from '@/router/axios'

export function pageTable(query) {
  return request({
    url: '/codegen/table/',
    method: 'get',
    params: query
  })
}

export function saveTable(obj) {
  return request({
    url: '/codegen/table/',
    method: 'post',
    data: obj
  })
}

export function findTable(query) {
  return request({
    url: '/codegen/table/formData',
    method: 'get',
    params: query
  })
}

export function findSelectTable() {
  return request({
    url: '/codegen/table/tableList',
    method: 'get'
  })
}

export function removeTable(id) {
  return request({
    url: '/codegen/table/' + id,
    method: 'delete'
  })
}


