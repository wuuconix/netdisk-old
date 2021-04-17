import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import home from '../components/home.vue'
import file from '../components/file.vue'
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    // redirect: '/all',
    children: [
      { path: '/all', component: file },
      { path: '/picture', component: file },
      { path: '/document', component: file },
      { path: '/video', component: file },
      { path: '/torrent', component: file },
      { path: '/music', component: file },
      { path: '/other', component: file }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
