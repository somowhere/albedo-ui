import request from '@/utils/request'

// eslint-disable-next-line no-unused-vars
const scope = 'server'
const loginService = {

  getDicts() {
    return request({
      url: '/sys/dict/codes',
      method: 'get'
    })
  },
  login(user) {
    const username = user.username; const password = user.password; const code = user.code; const randomStr = user.randomStr; const grant_type = 'password'
    return request({
      url: '/auth/oauth/token',
      headers: {
        isToken: false,
        'Authorization': 'Basic YWxiZWRvOmFsYmVkbw=='
      },
      method: 'post',
      params: { username, password, randomStr, code, grant_type, scope }
    })
  },
  refreshToken(refresh_token) {
    const grant_type = 'refresh_token'
    return request({
      url: '/auth/oauth/token',
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

export default loginService
