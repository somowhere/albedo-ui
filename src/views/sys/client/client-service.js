import request from '@/router/axios';
import validate from "@/util/validate";

let gateway = "/sys";
const clientService = {
  page(query) {
    return request({
      url: gateway + '/client/',
      method: 'get',
      params: query
    })
  },

  save(obj) {
    return request({
      url: gateway + '/client/',
      method: 'post',
      data: obj
    })
  },

  find(id) {
    return request({
      url: gateway + '/client/' + id,
      method: 'get'
    })
  },

  remove(id) {
    return request({
      url: gateway + '/client/' + id,
      method: 'delete'
    })
  },

  validateUnique(rule, value, callback, id) {
    validate.isUnique(rule, value, callback, gateway + '/client/checkByProperty?id=' + util.objToStr(id))
  }
};
export default clientService
