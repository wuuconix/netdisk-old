// ----------------------------------------------原始文件
// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'

// createApp(App).use(router).mount('#app')
// ----------------------------------------------
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import './assets/css/global.css' // 全局css，有一些背景图片啥的
import './assets/icon/iconfont.js'  //引入阿里矢量库iconfont
import axios from 'axios'
import VideoPlayer from 'vue-video-player/src'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import pdf from 'pdfobject'

// const protocol = window.location.protocol; //协议
let host = ""
if (window.location.host.includes(":")) //如果有分号说明有端口，则删掉
  host = window.location.host.substring(0, window.location.host.indexOf(':'))
else
  host = window.location.host

axios.defaults.baseURL = "https://" + host + ":3000/api"

const baseURLNoapi = "https://" + host + ":3000"
// const ip = 'localhost'
// axios.defaults.baseURL = 'http://' + ip + ':3000/api'
axios.interceptors.request.use(config => {
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})

const app = createApp(App)
app.config.globalProperties.$http = axios;
app.config.globalProperties.$baseURLNoapi = baseURLNoapi;
app.config.productionTip = false
app.use(router)
app.use(ElementPlus)
app.use(VideoPlayer)
app.use(pdf)
app.mount('#app')
