import Vue from 'vue'

import { BootstrapVue } from 'bootstrap-vue'
Vue.use(BootstrapVue)

import '../css/bootstrap.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../css/custom.scss'

// Import Icons
import { BIconAlertTriangleFill, BIconCheck, BIconX } from 'bootstrap-vue'
Vue.component('BIconAlertTriangleFill', BIconAlertTriangleFill)
Vue.component('BIconCheck', BIconCheck)
Vue.component('BIconX', BIconX)
