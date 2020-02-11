<template>
<div>
  <b-table-lite
    id="top-miners-table"
    :fields="fields"
    :items="items"
    responsive
    small
    >

    <template v-slot:cell(hashrate)="data">
      {{ data.value | hashrate }}
    </template>

    <template v-slot:cell(last_share)="data">
      {{ data.value | mul1000 | distanceInWords }}
    </template>

  </b-table-lite>

  <template v-if="items.length === 0">
    The pool currently does not have any connected miners.
  </template>

</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TopMinersTable',
  computed: {
    ...mapState({
      items: state => state.stats.pool_info.top_miners
    })
  },
  data() {
    return {
      fields: [
        {
          key: 'number',
          label: '#'
        },
        {
          key: 'username',
          label: 'Username'
        },
        {
          key: 'hashrate',
          label: 'Hashrate'
        },
        {
          key: 'last_share',
          label: 'Last Share'
        },
      ],
    }
  },
}
</script>
