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
import 'element-plus/lib/theme-chalk/index.css'
import './assets/css/global.css' // 全局css，有一些背景图片啥的
import './assets/icon/iconfont.js'  //引入阿里矢量库iconfont
import axios from 'axios'

const ip = 'localhost'
axios.defaults.baseURL = 'http://' + ip + ':3000/api'
axios.interceptors.request.use(config => {
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})

const app = createApp(App)

app.config.globalProperties.$http = axios;
app.config.globalProperties.$ip = ip;
app.config.productionTip = false
app.use(router)
app.use(ElementPlus)
app.mount('#app')
