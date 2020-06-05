const baseUrl = process.env.VUE_APP_BASE_URL
const defaultSettings = require('@/settings.js')
const api = {
  state: {
    // 实时控制台
    socketApi: baseUrl + '/websocket?token=kl',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html',
    // service
    serviceApi: 'http://albedo-gateway:5001',
    // 文件上传
    fileUploadApi: defaultSettings.api + '/file/upload',
    // baseUrl，
    baseUrl: baseUrl,
    // baseApi，
    baseApi: defaultSettings.api
  }
}

export default api
