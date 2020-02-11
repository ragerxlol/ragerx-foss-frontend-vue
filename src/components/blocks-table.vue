<template>
<div>
  <b-table
    id="blocks-table"
    :current-page="page"
    :fields="fields"
    :items="items"
    responsive
    small
    >

    <template v-slot:cell(blk_id)="data">
      {{ data.value | commas }}
    </template>

    <template v-slot:cell(height)="data">
      {{ data.value | commas }}
    </template>

    <template v-slot:cell(txid)="data">
      <a :href="`${$store.state.stats.coin.explorer_url}/tx/${data.value}`" target="_blank">
        <span class="text-monospace">{{ data.value }}</span>
      </a>
    </template>

    <template v-slot:cell(status)="data">
      <span :id="`block-status-${data.item.blk_id}`">
        <template v-if="data.value === -1">
          Orphaned
        </template>
        <template v-else-if="data.value === 0">
          Failed
        </template>
        <template v-else-if="data.value === 1">
          Submitted
        </template>
        <template v-else-if="data.value === 2">
          Pending
        </template>
        <template v-else-if="data.value === 3">
          Credited
        </template>
        <template v-else-if="data.value === 4">
          Matured
        </template>
        <template v-else-if="data.value === 5">
          Unlocked
        </template>
      </span>

      <template v-if="data.value >= 1 && data.value <= 3">
        <b-tooltip :target="`block-status-${data.item.blk_id}`" triggers="hover" placement="bottom">
          {{ Math.max(0, data.item.height + $store.state.stats.pool_info.payouts.maturity_requirement - $store.state.stats.network_info.height ) }} to go
        </b-tooltip>
      </template>

    </template>

    <template v-slot:cell(time)="data">
      <span :id="`block-time-${data.item.blk_id}`">
        {{ data.value | mul1000 | time }}
      </span>
      <b-tooltip :target="`block-time-${data.item.blk_id}`" triggers="hover" placement="bottom">
        {{ data.value | mul1000 | distanceInWords }}
      </b-tooltip>
    </template>

    <template v-slot:cell(reward)="data">
      <template v-if="data.item.status >= 2">
        {{ data.value | fixedMoney }}
      </template>
    </template>

    <template v-slot:cell(effort)="data">
      <template v-if="data.item.status >= 1">

        <span :id="`block-effort-${data.item.blk_id}`">
          <effort :value="data.value" />
        </span>

        <b-tooltip :target="`block-effort-${data.item.blk_id}`" triggers="hover" placement="bottom">
          <table>
            <tr><td>Submitted shares</td><td>{{ data.item.total_shares | commas }}</td></tr>
            <tr><td>Block difficulty</td><td>{{ data.item.difficulty | commas }}</td></tr>
          </table>
        </b-tooltip>

      </template>

      <template v-else>
        <b-icon-x variant="danger" />
      </template>

    </template>

  </b-table>

  <template v-if="total === 0">
    <div class="ml-1">
      The pool has not found any blocks yet.
    </div>
  </template>

  <template v-if="total > 15">
    <b-pagination
      v-model="page"
      :total-rows="total"
      :per-page="15"
      align="center"
      aria-controls="blocks-table"
      />
  </template>

</div>
</template>

<script>
export default {
  name: 'BlocksTable',
  data() {
    return {
      fields: [
        {
          key: 'blk_id',
          label: 'Block Number'
        },
        {
          key: 'height',
          label: 'Block Height'
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
          key: 'miner',
          label: 'Found By'
        },
        {
          key: 'time',
          label: 'Time'
        },
        {
          key: 'reward',
          label: 'Reward',
          // class: 'text-right'
        },
        {
          key: 'effort',
          label: 'Effort',
          // class: 'text-right',
          formatter: (value, key, item) => {
            return item.total_shares / item.difficulty
          }
        },
      ],
      page: 1,
      total: 0,
    }
  },
  methods: {
    items(ctx) {
      return this.$api.getBlocks(ctx.currentPage).then(response => {
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
