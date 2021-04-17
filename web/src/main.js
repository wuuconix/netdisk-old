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

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
