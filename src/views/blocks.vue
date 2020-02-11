<template>
<div>

  <b-row class="mt-3">

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Blocks Found">
        <b-card-text>
          <span id="blocks-blocks-found">
            {{ blocks_count.blocks_total | commas }}
            <template v-if="blocks_recent.length">
              ({{ blocks_recent[0].time | mul1000 | distanceInWords }})
            </template>
          </span>
          <b-tooltip target="blocks-blocks-found" triggers="hover" placement="bottom">
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
      <b-card title="Maturity Requirement">
        <b-card-text>
          <span id="blocks-maturity-requirement">
            {{ payouts.maturity_requirement | commas }} blocks
          </span>
          <b-tooltip target="blocks-maturity-requirement" triggers="hover" placement="bottom">
            {{ payouts.maturity_requirement * coin.coin_difficulty_target | minutes }}
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Average Effort">
        <b-card-text>
          <span id="blocks-">
            <effort :value="average_efforts[0]" />
          </span>
          <b-tooltip target="blocks-" triggers="hover" placement="bottom">
            <table>
              <tr><td>Last 100 blocks</td><td><effort :value="average_efforts[0]" /></td></tr>
              <tr><td>Last 1,000 blocks</td><td><effort :value="average_efforts[1]" /></td></tr>
              <tr><td>All</td><td><effort :value="average_efforts[2]" /></td></tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Current Effort">
        <b-card-text>
          <span id="blocks-current-effort">
            <effort :value="current_shares.block / current_difficulty" />
          </span>
          <b-tooltip target="blocks-current-effort" triggers="hover" placement="bottom">
            <table>
              <tr><td>Submitted shares</td><td>{{ current_shares.block | commas }}</td></tr>
              <tr><td>Block difficulty</td><td>{{ network_info.difficulty | commas }}</td></tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

  </b-row>

  <div>
    <block-chart-wrapper title="Blocks Mined" />
  </div>

  <b-card title="Pool Blocks" class="mt-3">
    <b-card-text>
      <blocks-table />
    </b-card-text>
  </b-card>

</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'blocks',
  computed: {
    ...mapState({
      coin: state => state.stats.coin,
      network_info: state => state.stats.network_info,
      blocks_count: state => state.stats.pool_info.blocks_count,
      blocks_recent: state => state.stats.pool_info.blocks_recent,
      current_shares: state => state.stats.pool_info.current_shares,
      current_difficulty: state => state.stats.network_info.difficulty,
      payouts: state => state.stats.pool_info.payouts,
      average_efforts: state => {
        const ae = state.stats.pool_info.average_efforts
        return [
          ae.last_100.difficulty > 0 ? ae.last_100.total_shares / ae.last_100.difficulty : 0,
          ae.last_1000.difficulty > 0 ? ae.last_1000.total_shares / ae.last_1000.difficulty : 0,
          ae.all.difficulty > 0 ? ae.all.total_shares / ae.all.difficulty : 0,
        ]
      }
    })
  }
}
</script>
