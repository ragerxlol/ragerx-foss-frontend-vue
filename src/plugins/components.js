import Vue from 'vue'

import Effort from '@/components/effort.vue'
import PayoutsTable from '@/components/payouts-table.vue'
import BlocksTable from '@/components/blocks-table.vue'
import TopMinersTable from '@/components/top-miners-table.vue'
import WorkersTable from '@/components/workers-table.vue'
import CreditsDebitsTable from '@/components/credits-debits-table.vue'
import HashrateChartWrapper from '@/components/hashrate-chart-wrapper.vue'
import HashrateChart from '@/components/hashrate-chart.vue'
import BlockChartWrapper from '@/components/block-chart-wrapper.vue'
import BlockChart from '@/components/block-chart.vue'
import UserSettings from '@/components/user-settings.vue'

Vue.component('Effort', Effort)
Vue.component('PayoutsTable', PayoutsTable)
Vue.component('BlocksTable', BlocksTable)
Vue.component('TopMinersTable', TopMinersTable)
Vue.component('WorkersTable', WorkersTable)
Vue.component('CreditsDebitsTable', CreditsDebitsTable)
Vue.component('HashrateChartWrapper', HashrateChartWrapper)
Vue.component('HashrateChart', HashrateChart)
Vue.component('BlockChartWrapper', BlockChartWrapper)
Vue.component('BlockChart', BlockChart)
Vue.component('UserSettings', UserSettings)
