import request from '@/router/axios';
import {isValidateUnique, toStr} from "@/util/validate";

let gateway="/gen";
export function fetchTestTreeBookTree(query) {
  return request({
    url: gateway+'/testTreeBook/tree',
    method: 'get',
    params: query
  })
}
export function pageTestTreeBook(query) {
  return request({
    url: gateway+'/testTreeBook/',
    method: 'get',
    params: query
  })
}

export function saveTestTreeBook(obj) {
  return request({
    url: gateway+'/testTreeBook/',
    method: 'post',
    data: obj
  })
}

export function findTestTreeBook(id) {
  return request({
    url: gateway+'/testTreeBook/' + id,
    method: 'get'
  })
}

export function removeTestTreeBook(id) {
  return request({
    url: gateway+'/testTreeBook/' + id,
    method: 'delete'
  })
}

export function validateUniqueTestTreeBook(rule, value, callback, id) {
  isValidateUnique(rule, value, callback, gateway+'/testTreeBook/checkByProperty?id='+toStr(id))
}
