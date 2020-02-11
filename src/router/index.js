import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {

  const authorized = store.state.init.user

  if(to.name === 'login' && authorized) {
    return next({ name: 'user-dashboard', replace: true })
  }

  if(to.name === 'user-dashboard' && !authorized) {
    return next({ name: 'login', replace: true })
  }

  next()

})

export default router
