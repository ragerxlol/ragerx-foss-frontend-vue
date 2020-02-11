import Statistics from '../views/statistics.vue'
import Blocks from '../views/blocks.vue'
import Payouts from '../views/payouts.vue'
import Login from '../views/login.vue'
import Dashboard from '../views/dashboard.vue'

import Debug from '../views/debug.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Statistics
  },
  {
    path: '/blocks',
    name: 'blocks',
    component: Blocks
  },
  {
    path: '/payouts',
    name: 'payouts',
    component: Payouts
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/user-dashboard',
    name: 'user-dashboard',
    component: Dashboard
  },
  {
    path: '/debug',
    name: 'debug',
    component: Debug
  }
]

export default routes
