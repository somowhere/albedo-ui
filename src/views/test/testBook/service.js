import request from '@/router/axios';
import {isValidateUnique, toStr} from "@/util/validate";

let gateway="/gen";
export function pageTestBook(query) {
  return request({
    url: gateway+'/testBook/',
    method: 'get',
    params: query
  })
}

export function saveTestBook(obj) {
  return request({
    url: gateway+'/testBook/',
    method: 'post',
    data: obj
  })
}

export function findTestBook(id) {
  return request({
    url: gateway+'/testBook/' + id,
    method: 'get'
  })
}

export function removeTestBook(id) {
  return request({
    url: gateway+'/testBook/' + id,
    method: 'delete'
  })
}

export function validateUniqueTestBook(rule, value, callback, id) {
  isValidateUnique(rule, value, callback, gateway+'/testBook/checkByProperty?id='+toStr(id))
}
