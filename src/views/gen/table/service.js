
import request from '@/router/axios'

export function pageTable(query) {
  return request({
    url: '/gen/table/',
    method: 'get',
    params: query
  })
}

export function saveTable(obj) {
  return request({
    url: '/gen/table/',
    method: 'post',
    data: obj
  })
}

export function findTable(query) {
  return request({
    url: '/gen/table/formData',
    method: 'get',
    params: query
  })
}

export function findSelectTable() {
  return request({
    url: '/gen/table/tableList',
    method: 'get'
  })
}

export function removeTable(id) {
  return request({
    url: '/gen/table/' + id,
    method: 'delete'
  })
}


