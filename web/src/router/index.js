import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import home from '../components/home.vue'
import ViewPDF from '../components/ViewPDF.vue'
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
    redirect: '/all',
    children: [
      { path: '/all', component: home },
      { path: '/picture', component: home },
      { path: '/document', component: home },
      { path: '/video', component: home },
      { path: '/torrent', component: home },
      { path: '/music', component: home },
      { path: '/other', component: home }
    ]
  },
  {
    path: '/pdf',
    name: 'pdf',
    component: ViewPDF
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
