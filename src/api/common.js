import request from '@/utils/request'
import qs from 'qs'

// eslint-disable-next-line no-unused-vars
const scope = 'server'
const commonService = {

  getDicts() {
    return request({
      url: '/sys/dict/codes',
      method: 'get'
    })
  },
  login(user) {
    const username = user.username; const password = user.password; const code = user.code; const randomStr = user.randomStr; const grant_type = 'password'
    const dataObj = qs.stringify({ 'username': username, 'password': password })
    return request({
      url: '/auth/oauth2/token',
      headers: {
        isToken: false,
        'Authorization': 'Basic YWxiZWRvOmFsYmVkbw=='
      },
      method: 'post',
      params: { randomStr, code, grant_type, scope },
      data: dataObj
    })
  },
  refreshToken(refresh_token) {
    const grant_type = 'refresh_token'
    return request({
      url: '/auth/oauth2/token',
      headers: {
        'isToken': false,
        'Authorization': 'Basic YWxiZWRvOmFsYmVkbw=='
      },
      method: 'post',
      params: { refresh_token, grant_type, scope }
    })
  },
  getUser() {
    return request({
      url: '/sys/user/info',
      method: 'get'
    })
  },
  logout() {
    return request({
      url: '/auth/token/logout',
      method: 'delete'
    })
  }
}

export default commonService
