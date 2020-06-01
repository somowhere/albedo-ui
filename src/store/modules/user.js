import commonUtil from '@/utils/common'
import loginService from '@/api/login'
import storeApi from '@/utils/store'

const user = {
  state: {
    user: {},
    roles: [],
    permissions: [],
    expiresIn: storeApi.get({
      name: 'expiresIn'
    }) || '',
    accessToken: storeApi.get({
      name: 'accessToken'
    }) || '',
    refreshToken: storeApi.get({
      name: 'refreshToken'
    }) || ''
  },

  mutations: {
    SET_ACCESS_TOKEN: (state, accessToken) => {
      state.accessToken = accessToken
      storeApi.set({
        name: 'accessToken',
        content: state.accessToken,
        type: 'session'
      })
    },
    SET_EXPIRES_IN: (state, expiresIn) => {
      state.expiresIn = expiresIn
      storeApi.set({
        name: 'expiresIn',
        content: state.expiresIn,
        type: 'session'
      })
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken
      storeApi.set({
        name: 'refreshToken',
        content: state.refreshToken,
        type: 'session'
      })
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }

  },

  actions: {
    // 登录
    Login({ commit }, user) {
      const params = commonUtil.encryption({
        data: user,
        key: 'somewhere-albedo',
        param: ['password']
      })
      return new Promise((resolve, reject) => {
        loginService.login(params).then(response => {
          commit('SET_ACCESS_TOKEN', response.access_token)
          commit('SET_REFRESH_TOKEN', response.refresh_token)
          commit('SET_EXPIRES_IN', response.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 刷新token
    refreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        loginService.refreshToken(state.refreshToken).then(response => {
          const data = response.data
          commit('SET_ACCESS_TOKEN', data.access_token)
          commit('SET_REFRESH_TOKEN', data.refresh_token)
          commit('SET_EXPIRES_IN', data.expires_in)
          commit('CLEAR_LOCK')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUser({ commit }) {
      return new Promise((resolve, reject) => {
        loginService.getUser().then((res) => {
          const data = res.data || {}
          setUserInfo(data, commit)
          resolve(data)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        loginService.logout().then(res => {
          logOut(commit)
          resolve()
        }).catch(error => {
          logOut(commit)
          reject(error)
        })
      })
    }
  }
}

export const logOut = (commit) => {
  commit('SET_ACCESS_TOKEN', '')
  commit('SET_REFRESH_TOKEN', '')
  commit('SET_EXPIRES_IN', '')
  commit('SET_USER', {})
  commit('SET_ROLES', [])
  commit('SET_PERMISSIONS', [])
}

export const setUserInfo = (res, commit) => {
  commit('SET_USER', res.user)
  commit('SET_ROLES', res.roles || [])
  commit('SET_PERMISSIONS', res.permissions || [])
}

export default user
