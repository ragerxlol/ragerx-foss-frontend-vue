import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'

import init from './plugins/init'
import './plugins/axios'
import './plugins/filters'
import './plugins/components'
import './plugins/bootstrap-vue'

import App from './App.vue'
import store from './store'
import router from './router'

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: h => h(App)
})

init({ Vue, app, store, router })

app.$mount('#app')
