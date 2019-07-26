import request from '@/router/axios';
import {isValidateUnique, toStr} from "@/util/validate";

let gateway="/sys";
export function pageClient(query) {
  return request({
    url: gateway+'/client/',
    method: 'get',
    params: query
  })
}

export function saveClient(obj) {
  return request({
    url: gateway+'/client/',
    method: 'post',
    data: obj
  })
}

export function findClient(id) {
  return request({
    url: gateway+'/client/' + id,
    method: 'get'
  })
}

export function removeClient(id) {
  return request({
    url: gateway+'/client/' + id,
    method: 'delete'
  })
}

export function validateUniqueClient(rule, value, callback, id) {
  isValidateUnique(rule, value, callback, gateway+'/client/checkByProperty?id='+toStr(id))
}
