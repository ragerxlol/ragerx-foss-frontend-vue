<template>
<div>

  <b-row class="mt-3">

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Pool Hashrate">
        <b-card-text>
          <span id="statistics-pool-hashrate">
            {{ hashrate.current | hashrate }}
          </span>
          <b-tooltip target="statistics-pool-hashrate" triggers="hover" placement="bottom">
            <table>
              <tr><td>Current</td><td>{{ hashrate.current | hashrate }}</td></tr>
              <tr><td>Average (1 hour)</td><td>{{ hashrate.average_1hr | hashrate }}</td></tr>
              <tr><td>Average (6 hour)</td><td>{{ hashrate.average_6hr | hashrate }}</td></tr>
              <tr><td>Average (24 hour)</td><td>{{ hashrate.average_24hr | hashrate }}</td></tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Blocks Found">
        <b-card-text>
          <span id="statistics-blocks-found">
            {{ blocks_count.blocks_total | commas }}
            <template v-if="blocks_recent.length">
              ({{ blocks_recent[0].time | mul1000 | distanceInWords }})
            </template>
          </span>
          <b-tooltip target="statistics-blocks-found" triggers="hover" placement="bottom">
            <table>
              <tr><td>Pending</td><td>{{ blocks_count.blocks_ok + blocks_count.blocks_tx_seen + blocks_count.blocks_credited | commas }}</td></tr>
              <tr><td>Matured</td><td>{{ blocks_count.blocks_matured + blocks_count.blocks_closed | commas }}</td></tr>
              <tr><td>Orphaned</td><td>{{ blocks_count.blocks_orphaned | commas }}</td></tr>
              <tr><td>Failed</td><td>{{ blocks_count.blocks_failed | commas }}</td></tr>
              <tr><td>Total mined</td><td>{{ blocks_count.total_mined | fixedMoney }}</td></tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Blocks Found Every">
        <b-card-text>
          <span id="statistics-pool-percentage">
            <template v-if="pool_percentage">
              {{ coin.coin_difficulty_target / pool_percentage | mul1000 | distanceInterval }} (estimated)
            </template>
            <template v-else>
              N/A
            </template>
          </span>
          <b-tooltip target="statistics-pool-percentage" triggers="hover" placement="bottom">
            This pool has {{ pool_percentage | percentage(1) }} of the network hashrate
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Current Effort">
        <b-card-text>
          <span id="statistics-current-effort">
            <effort :value="current_shares.block / network_info.difficulty" />
          </span>
          <b-tooltip target="statistics-current-effort" triggers="hover" placement="bottom">
            <table>
              <tr><td>Submitted shares</td><td>{{ current_shares.block | commas }}</td></tr>
              <tr><td>Block difficulty</td><td>{{ network_info.difficulty | commas }}</td></tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Network Hashrate">
        <b-card-text>
          <span id="statistics-network-hashrate">
            {{ network_info.hashrate | hashrate }}
          </span>
          <b-tooltip target="statistics-network-hashrate" triggers="hover" placement="bottom">
            Network difficulty {{ network_info.difficulty | commas }}
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Blockchain Height">
        <b-card-text>
          <span id="statistics-blockchain-height">
            {{ network_info.height | commas }}
          </span>
          <b-tooltip target="statistics-blockchain-height" triggers="hover" placement="bottom">
            Last network block found {{ 1000 * network_info.last_timestamp | distanceInWords }}
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Connected Miners">
        <b-card-text>
          <span id="statistics-connected-miners">
            {{ active.miners | commas }} miners ({{ active.workers | commas }} workers)
          </span>
          <b-tooltip target="statistics-connected-miners" triggers="hover" placement="bottom">
            The number of miners and individual workers that have submitted a share in the last 5 minutes
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="PPLNS Duration">
        <b-card-text>
          <span id="statistics-pplns-duration">
            {{ $store.getters.get_pplns_window }}
          </span>
          <b-tooltip target="statistics-pplns-duration" triggers="hover" placement="bottom">
            Shares submitted within this timeframe will be credited at the next block
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Pool Fee">
        <b-card-text>
          {{ payouts.pool_fee }}%
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Minimum Payout">
        <b-card-text>
          {{ payouts.min_payout | money }}
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Payout Interval">
        <b-card-text>
          <span id="statistics-payout-interval">
            Every {{ payouts.payments_blocks_interval }} network blocks
          </span>
          <b-tooltip target="statistics-payout-interval" triggers="hover" placement="bottom">
            <table>
              <tr><td colspan="2">About {{ payouts.payments_blocks_interval * coin.coin_difficulty_target | minutes }}</td></tr>
              <tr><td>Next payment</td><td>{{ next_payment }} block{{ next_payment === 1 ? '' : 's'}}</td></tr>
              <tr><td>Network block time</td><td>{{ coin.coin_difficulty_target | minutes }}</td></tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Market Price">
        <b-card-text>
          <span id="statistics-market-price">
            {{ price_info.BTC }} BTC
          </span>
          <b-tooltip target="statistics-market-price" triggers="hover" placement="bottom">
            <table>
              <tr v-for="(currency, symbol) in price_info" :key="currency">
                <td>{{ currency }} {{ symbol }}</td>
              </tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

  </b-row>

  <div>
    <hashrate-chart-wrapper title="Pool Hashrate" type="pool_hashrate_graph" />
  </div>

  <div class="mt-3">
    <hashrate-chart-wrapper title="Network Hashrate" type="network_hashrate_graph" />
  </div>

  <b-card title="Top Miners" class="mt-3">
    <b-card-text>
      <top-miners-table />
    </b-card-text>
  </b-card>

</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'statistics',
  computed: {
    ...mapState({
      coin: state => state.stats.coin,
      network_info: state => state.stats.network_info,
      price_info: state => state.stats.price_info,
      hashrate: state => state.stats.pool_info.hashrate,
      active: state => state.stats.pool_info.active,
      blocks_count: state => state.stats.pool_info.blocks_count,
      blocks_recent: state => state.stats.pool_info.blocks_recent,
      current_shares: state => state.stats.pool_info.current_shares,
      payouts: state => state.stats.pool_info.payouts,
    }),
    pool_percentage() {
      return this.coin.coin_difficulty_target * this.hashrate.current / this.network_info.difficulty
    },
    next_payment() {
      return this.payouts.payments_blocks_interval - this.network_info.height % this.payouts.payments_blocks_interval
    },
  }
}
</script>
