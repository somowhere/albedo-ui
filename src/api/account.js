import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

const accountService = {
  updatePass(user) {
    const data = {
      oldPassword: encrypt(user.oldPassword),
      newPassword: encrypt(user.newPassword),
      confirmPassword: encrypt(user.confirmPassword)
    }
    return request({
      url: '/sys/account/change-password',
      method: 'post',
      data
    })
  },
  resetEmailSend(data) {
    return request({
      url: '/sys/account/reset/email-send?email=' + data,
      method: 'post'
    })
  },

  updateEmail(form) {
    const data = {
      password: encrypt(form.pass),
      email: form.email
    }
    return request({
      url: '/sys/account/change-email/' + form.code,
      method: 'post',
      data
    })
  },
  updateAvatar(avatar) {
    return request({
      url: '/sys/account/change-avatar',
      method: 'post',
      params: { avatar: avatar }
    })
  }
}

export default accountService
