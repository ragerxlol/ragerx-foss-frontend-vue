<template>
<b-card>
  <b-card-title>
    <b-row>
      <b-col cols="auto" class="mr-auto">
        {{ title }}
      </b-col>
      <b-col cols="auto">
        <b-form-select
          v-model="resolution"
          :options="options"
          />
      </b-col>
    </b-row>
  </b-card-title>
  <b-card-text>
    <block-chart :data="data" :unit="unit" style="height:200px" />
  </b-card-text>
</b-card>
</template>

<script>
import * as moment from 'moment'
export default {
  name: 'BlockGraphWrapper',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    const options = [
      {
        text: '24 Hours',
        value: '24hr'
      },
      {
        text: '7 Days',
        value: '7d'
      },
      {
        text: '30 Days',
        value: '30d'
      },
    ]
    return {
      resolution: options[2].value,
      options,
    }
  },
  computed: {
    unit() {
      if(this.resolution === '24hr') {
        return 'hour'
      } else if(this.resolution === '7d') {
        return 'day'
      } else if(this.resolution === '30d') {
        return 'day'
      }
    },
    data() {
      let data = {}, start_time
      const now = moment()

      // Set ending point
      data[now.startOf(this.unit).valueOf()] = 0

      if(this.resolution === '24hr') {
        start_time = now.subtract(1, 'days').startOf(this.unit)
      } else if(this.resolution === '7d') {
        start_time = now.subtract(7, 'days').startOf(this.unit)
      } else if(this.resolution === '30d') {
        start_time = now.subtract(30, 'days').startOf(this.unit)
      }

      // Set starting point
      data[start_time.valueOf()] = 0

      // Loop through blocks per hour and sum blocks into unit
      for(let datum of this.$store.state.stats.pool_info.blocks_graph) {
        const time = moment(1000 * datum.time).startOf(this.unit)
        const count = parseInt(datum.count) || 0
        if(time.isSameOrAfter(start_time)) {
          const key = time.valueOf()
          if(!data.hasOwnProperty(key)) {
            data[key] = 0
          }
          data[key] += count
        }
      }

      // Return an array of objects
      return Object.entries(data).map(datum => ( { x: parseInt(datum[0]), y: datum[1] } ))
    }
  }
}
</script>
