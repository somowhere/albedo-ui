import request from '@/router/axios'

export function pageTestBook(query) {
  return request({
    url: '/testBook/',
    method: 'get',
    params: query
  })
}

export function saveTestBook(obj) {
  return request({
    url: '/testBook/',
    method: 'post',
    data: obj
  })
}

export function findTestBook(id) {
  return request({
    url: '/testBook/' + id,
    method: 'get'
  })
}

export function removeTestBook(id) {
  return request({
    url: '/testBook/' + id,
    method: 'delete'
  })
}