import request from '@/router/axios'


export function fetchTestTreeBookTree(query) {
  return request({
    url: '/testTreeBook/findTreeData',
    method: 'get',
    params: query
  })
}
export function pageTestTreeBook(query) {
  return request({
    url: '/testTreeBook/',
    method: 'get',
    params: query
  })
}

export function saveTestTreeBook(obj) {
  return request({
    url: '/testTreeBook/',
    method: 'post',
    data: obj
  })
}

export function findTestTreeBook(id) {
  return request({
    url: '/testTreeBook/' + id,
    method: 'get'
  })
}

export function removeTestTreeBook(id) {
  return request({
    url: '/testTreeBook/' + id,
    method: 'delete'
  })
}
export function lockTestTreeBook(id) {
  return request({
    url: '/testTreeBook/' + id,
    method: 'put'
  })
}