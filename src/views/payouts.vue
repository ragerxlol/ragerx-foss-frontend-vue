<template>
<div>

  <b-row class="mt-3">

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Total Payouts">
        <b-card-text>
          <span id="payouts-total-payouts">
            {{ payments_count.payment_total | commas }}
            ({{ payments_count.total_payees }} miners)
          </span>
          <b-tooltip target="payouts-total-payouts" triggers="hover" placement="bottom">
            <table>
              <tr><td>Pending</td><td>{{ payments_count.payment_pending | commas }}</td></tr>
              <tr><td>Matured</td><td>{{ payments_count.payment_matured | commas }}</td></tr>
              <tr><td>Orphaned</td><td>{{ payments_count.payment_orphaned | commas }}</td></tr>
              <tr><td>Total paid</td><td>{{ payments_count.total_paid | fixedMoney }}</td></tr>
              <tr><td>Total tx fees</td><td>{{ payments_count.total_fee | fixedMoney }}</td></tr>
            </table>
          </b-tooltip>
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
          <span id="payouts-payout-interval">
            Every {{ payouts.payments_blocks_interval }} network blocks
          </span>
          <b-tooltip target="payouts-payout-interval" triggers="hover" placement="bottom">
            <table>
              <tr><td colspan="2">About {{ payouts.payments_blocks_interval * coin.coin_difficulty_target | minutes }}</td></tr>
              <tr><td>Network block time</td><td>{{ coin.coin_difficulty_target | minutes }}</td></tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

    <b-col md="6" lg="3" class="mb-3">
      <b-card title="Next Payment">
        <b-card-text>
          <span id="payouts-next-payment">
            <template v-if="next_payment === 1">
              {{ next_payment }} block
            </template>
            <template v-else>
              {{ next_payment }} blocks
            </template>
          </span>
          <b-tooltip target="payouts-next-payment" triggers="hover" placement="bottom">
            <table>
              <tr><td colspan="2">About {{ next_payment * coin.coin_difficulty_target | minutes }}</td></tr>
              <tr><td>Network block time</td><td>{{ coin.coin_difficulty_target | minutes }}</td></tr>
            </table>
          </b-tooltip>
        </b-card-text>
      </b-card>
    </b-col>

  </b-row>

  <b-card title="Pool Payouts">
    <b-card-text>
      <payouts-table />
    </b-card-text>
  </b-card>

</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'payouts',
  computed: {
    ...mapState({
      coin: state => state.stats.coin,
      network_info: state => state.stats.network_info,
      payments_count: state => state.stats.pool_info.payments_count,
      payouts: state => state.stats.pool_info.payouts,
    }),
    next_payment() {
      return this.payouts.payments_blocks_interval - this.network_info.height % this.payouts.payments_blocks_interval
    },
  }
}
</script>
