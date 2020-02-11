<template>
<div>
  <b-table-lite
    id="workers-table"
    :fields="fields"
    :items="items"
    responsive
    small
    >

    <template v-slot:cell(is_active)="data">
      <template v-if="data.value">
        <b-icon-check variant="success" />
      </template>
      <template v-else>
        <b-icon-x variant="danger" />
      </template>
    </template>

    <template v-slot:cell(hashrate)="data">
      {{ data.value | hashrate }}
    </template>

    <template v-slot:cell(hashrate_1hr)="data">
      {{ data.value | hashrate }}
    </template>

    <template v-slot:cell(hashrate_6hr)="data">
      {{ data.value | hashrate }}
    </template>

    <template v-slot:cell(hashrate_24hr)="data">
      {{ data.value | hashrate }}
    </template>

    <template v-slot:cell(last_share)="data">
      {{ data.value | mul1000 | distanceInWords }}
    </template>

  </b-table-lite>

  <template v-if="items.length === 0">
    You have not connected any workers yet. Read the <router-link :to="{ name: 'getting-started', hash: '#download' }">Getting Started</router-link> page to connect your first worker.
  </template>

</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'WorkersTable',
  computed: {
    ...mapState({
      user: state => state.user,
    }),
    items() {
      const rigs = [ ...this.user.rigs ]
      for(let rig of rigs) {
        const { rid } = rig
        rig.hashrate = this.user.hashrate.current[rid]
        rig.hashrate_1hr = this.user.hashrate.average_1hr[rid]
        rig.hashrate_6hr = this.user.hashrate.average_6hr[rid]
        rig.hashrate_24hr = this.user.hashrate.average_24hr[rid]
      }
      return rigs.sort((a, b) => a.last_share < b.last_share)
    }
  },
  data() {
    return {
      fields: [
        {
          key: 'is_active',
          label: 'Active'
        },
        {
          key: 'name',
          label: 'Name'
        },
        {
          key: 'hashrate',
          label: 'Current Hashrate'
        },
        {
          key: 'hashrate_1hr',
          label: 'Average Hashrate (1 hour)'
        },
        {
          key: 'hashrate_6hr',
          label: 'Average Hashrate (6 hours)'
        },
        {
          key: 'hashrate_24hr',
          label: 'Average Hashrate (24 hours)'
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
