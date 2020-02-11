<template>
<div v-if="init.user" class="mt-3">

  <b-row align-v="center">
    <b-col cols="auto">
      <h1 class="my-0">Hello, {{ user.info.username }}</h1>
    </b-col>
    <b-col cols="auto">
      <b-button
        variant="outline-primary"
        size="sm"
        class="mr-3"
        v-b-modal.user-settings
        >
        Settings
      </b-button>
      <b-button
        variant="outline-primary"
        size="sm"
        @click="$user.logout()"
        >
        Logout
      </b-button>
    </b-col>
  </b-row>

  <b-row class="mt-3">

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Current Hashrate">
        <b-card-text>
          <span id="dashboard-current-hashrate">
            {{ user.hashrate.current.total | hashrate }}
          </span>
          <b-tooltip target="dashboard-current-hashrate" triggers="hover" placement="bottom">
            <table>
              <tr><td>Current</td><td>{{ user.hashrate.current.total | hashrate }}</td></tr>
              <tr><td>Average (1 hour)</td><td>{{ user.hashrate.average_1hr.total | hashrate }}</td></tr>
              <tr><td>Average (6 hour)</td><td>{{ user.hashrate.average_6hr.total | hashrate }}</td></tr>
              <tr><td>Average (24 hour)</td><td>{{ user.hashrate.average_24hr.total | hashrate }}</td></tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Worker Count">
        <b-card-text>
          <span id="dashboard-worker-count">
            {{ workers_active }} active ({{ workers_total }} total)
          </span>
          <b-tooltip target="dashboard-worker-count" triggers="hover" placement="bottom">
            Last share submitted {{ last_share | mul1000 | distanceInWords }}
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>


    <b-col md="6" lg="3" class="mb-3">
      <b-card title="PPLNS Duration">
        <b-card-text>
          <span id="dashboard-pplns-duration">
            {{ $store.getters.get_pplns_window }}
          </span>
          <b-tooltip target="dashboard-pplns-duration" triggers="hover" placement="bottom">
            Shares submitted within this timeframe will be credited at the next block
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>


    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Round Contribution">
        <b-card-text>
          <span id="dashboard-round-contribution">
            {{ round_percentage | percentage(4) }}
          </span>
          <b-tooltip target="dashboard-round-contribution" triggers="hover" placement="bottom">
            <table>
              <tr><td>Your shares</td><td>{{ user.shares | commas }}</td></tr>
              <tr><td>Pool shares</td><td>{{ current_shares.pplns | commas }}</td></tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Confirmed Balance">
        <b-card-text>
          {{ confirmed_balance | fixedMoney }}
        </b-card-text>
        <template v-slot:footer>
          <span id="dashboard-confirmed-balance">
            <b-progress :value="confirmed_balance" :max="user.info.payment_threshold" />
          </span>
          <b-tooltip target="dashboard-confirmed-balance" triggers="hover" placement="bottom">
            <template v-if="confirmed_balance >= user.info.payment_threshold">
              You have reached your payout level. Payment will be processed in the next payment round.
            </template>
            <template v-else>
              You have reached {{ confirmed_balance / user.info.payment_threshold | percentage(1) }}
              of your {{ user.info.payment_threshold | money }} payout level.
            </template>
          </b-tooltip>
        </template>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Unconfirmed Balance">
        <b-card-text>
          {{ user.balances.credits_pending | fixedMoney }}
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Total Paid">
        <b-card-text>
          {{ user.balances.debits | fixedMoney }}
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Estimated Next Reward">
        <b-card-text>
          {{ next_payment | fixedMoney }}
        </b-card-text>
      </b-card>
    </b-col>

  </b-row>

  <div>
    <hashrate-chart-wrapper title="Hashrate" type="user_hashrate_graph" />
  </div>

  <b-card title="Workers" class="mt-3">
    <b-card-text>
      <workers-table />
    </b-card-text>
  </b-card>

  <b-card title="Credits / Debits" class="mt-3">
    <b-card-text>
      <credits-debits-table />
    </b-card-text>
  </b-card>

  <user-settings />

</div>
<div v-else>
  <div class="text-center my-5">
    <b-spinner variant="primary" style="width: 3rem; height: 3rem;" />
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Dashboard',
  computed: {
    confirmed_balance() {
      return this.user.balances.credits_matured - this.user.balances.debits
    },
    workers_active() {
      let count = 0
      for(const rig of this.user.rigs) {
        if(rig.is_active) {
          count++
        }
      }
      return count
    },
    workers_total() {
      return this.user.rigs.length
    },
    round_percentage() {
      if(this.current_shares.pplns != 0) {
        return this.user.shares / this.current_shares.pplns
      }
      return 0
    },
    next_payment() {
      return this.round_percentage * this.last_reward
    },
    last_share() {
      return Math.max(...this.user.rigs.map(rig => rig.last_share), 0)
    },
    ...mapState({
      init: state => state.init,
      user: state => state.user,
      current_shares: state => state.stats.pool_info.current_shares,
      last_reward: state => state.stats.network_info.last_reward,
    })
  }
}
</script>
