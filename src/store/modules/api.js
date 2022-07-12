const baseUrl = process.env.VUE_APP_BASE_URL
const defaultSettings = require('@/settings.js')
const api = {
  state: {
    // 实时控制台
    socketApi: baseUrl + '/websocket?token=kl',
    // swagger
    swaggerApi: baseUrl + '/webjars/swagger-ui/index.html',
    // service
    serviceApi: 'http://albedo-monitor:5001',
    // 文件上传
    fileUploadApi: defaultSettings.api + '/sys/file/upload',
    // baseUrl，
    baseUrl: baseUrl,
    // baseApi，
    baseApi: defaultSettings.api
  }
}

export default api
