<template>
<div>
  <b-table
    id="payouts-table"
    :current-page="page"
    :fields="fields"
    :items="items"
    responsive
    small
    >

    <template v-slot:cell(payment_number)="data">
      {{ data.value | commas }}
    </template>

    <template v-slot:cell(txid)="data">
      <a :href="`${$store.state.stats.coin.explorer_url}/tx/${data.value}`" target="_blank">
        <span class="text-monospace">{{ data.value }}</span>
      </a>
    </template>

    <template v-slot:cell(status)="data">
      <template v-if="data.value === -1">
        Orphaned
      </template>
      <template v-else-if="data.value === 0">
        Unconfirmed
      </template>
      <template v-else-if="data.value === 1">
        Confirmed
      </template>
    </template>

    <template v-slot:cell(paid)="data">
      {{ data.value | fixedMoney }}
    </template>

    <template v-slot:cell(fee)="data">
      {{ data.value | fixedMoney }}
    </template>

    <template v-slot:cell(time)="data">
      <span :id="`payment-time-${data.item.payment_number}`">
        {{ data.value | mul1000 | time }}
      </span>
      <b-tooltip :target="`payment-time-${data.item.payment_number}`" triggers="hover" placement="bottom">
        {{ data.value | mul1000 | distanceInWords }}
      </b-tooltip>
    </template>

  </b-table>

  <template v-if="total === 0">
    <div class="ml-1">
      The pool has not made any payments yet.
    </div>
  </template>

  <template v-if="total > 15">
    <b-pagination
      v-model="page"
      :total-rows="total"
      :per-page="15"
      align="center"
      aria-controls="payouts-table"
      />
  </template>
</div>
</template>

<script>
export default {
  name: 'PayoutsTable',
  data() {
    return {
      fields: [
        {
          key: 'payment_number',
          label: 'Payout Number'
        },
        {
          key: 'txid',
          label: 'Txid'
        },
        {
          key: 'status',
          label: 'Status'
        },
        {
          key: 'paid',
          label: 'Amount Paid'
        },
        {
          key: 'fee',
          label: 'Tx Fee'
        },
        {
          key: 'payees',
          label: 'Payees'
        },
        {
          key: 'time',
          label: 'Time'
        },
      ],
      page: 1,
      total: 0,
    }
  },
  methods: {
    items(ctx) {
      return this.$api.getPayments(ctx.currentPage).then(response => {
        this.total = response.total
        return response.data
      }).catch(error => {
        this.total = 0
        return []
      })
    }
  }
}
</script>
