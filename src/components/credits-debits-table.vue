<template>
<div>
  <b-table
    id="credits-debits-table"
    :current-page="page"
    :fields="fields"
    :items="items"
    responsive
    small
    >

    <template v-slot:cell(memo)="data">
      <template v-if="data.item.type == 'debit_payment'">
        <a :href="`${$store.state.stats.coin.explorer_url}/tx/${data.value}`" target="_blank">
          <span class="text-monospace">{{ data.value }}</span>
        </a>
      </template>
      <template v-else>
        {{ data.value }}
      </template>
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

    <template v-slot:cell(time)="data">
      <span :id="`credits-debits-time-${data.index}`">
        {{ data.value | mul1000 | time }}
      </span>
      <b-tooltip :target="`credits-debits-time-${data.index}`" triggers="hover" placement="bottom">
        {{ data.value | mul1000 | distanceInWords }}
      </b-tooltip>
    </template>

    <template v-slot:cell(credits)="data">
      <template v-if="data.item.type.startsWith('credit')">
        {{ data.item.amount | fixedMoney }}
      </template>
    </template>

    <template v-slot:cell(debits)="data">
      <template v-if="data.item.type.startsWith('debit')">
        {{ data.item.amount | fixedMoney }}
      </template>
    </template>

    <template v-slot:cell(running_total)="data">
      {{ data.value | fixedMoney }}
    </template>

  </b-table>

  <template v-if="total === 0">
    <div class="ml-1">
      You have not received any credits yet.
    </div>
  </template>

  <template v-if="total > 15">
    <b-pagination
      v-model="page"
      :total-rows="total"
      :per-page="15"
      align="center"
      aria-controls="credits-debits-table"
    />
  </template>
</div>
</template>

<script>
export default {
  name: 'CreditsDebitsTable',
  data() {
    return {
      fields: [
        {
          key: 'memo',
          label: 'Memo',
          formatter: (value, key, item) => {
            let height = ''
            if(item.height) {
              height = this.$options.filters.commas(item.height)
            }
            switch(item.type) {
            case 'credit_reward':
              return `Miner block reward credit for block ${height}`
            case 'credit_admin':
              return 'Admin correction'
            case 'credit_bonus':
              return `Bonus credit for block ${height}`
            case 'credit_dev':
              return `Dev fee credit for block ${height}`
            case 'debit_payment':
              return item.txid
            case 'debit_admin':
              return 'Admin correction'
            case 'debit_fee':
              return 'Transaction fee'
            default:
              return 'Other'
            }
          },
        },
        {
          key: 'status',
          label: 'Status',
        },
        {
          key: 'time',
          label: 'Time',
        },
        {
          key: 'type',
          formatter: (value, key, item) => {
            switch(item.type) {
            case 'credit_reward':
              return 'Block Reward'
            case 'credit_admin':
              return 'Admin Manual Credit'
            case 'credit_bonus':
              return 'Bonus'
            case 'credit_dev':
              return 'Dev Fee'
            case 'debit_payment':
              return 'Payment'
            case 'debit_admin':
              return 'Admin Manual Debit'
            case 'debit_fee':
              return 'Transaction fee'
            default:
              return val
            }
          },
        },
        {
          key: 'credits',
          label: 'Credits',
        },
        {
          key: 'debits',
          label: 'Debits',
        },
        {
          key: 'running_total',
          label: 'Balance',
        },
      ],
      page: 1,
      total: 0,
    }
  },
  methods: {
    items(ctx) {
      return this.$user.getCreditsDebits(ctx.currentPage).then(response => {
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
