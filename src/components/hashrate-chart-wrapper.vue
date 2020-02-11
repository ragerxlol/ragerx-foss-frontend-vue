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
          :disabled="loading"
          />
      </b-col>
    </b-row>
  </b-card-title>
  <b-card-text>
    <template v-if="loading">
      <div class="text-center py-5" style="height:400px">
        <b-spinner variant="primary" style="width: 3rem; height: 3rem;" />
      </div>
    </template>
    <template v-else>
      <hashrate-chart :data="data" :unit="unit" />
    </template>
  </b-card-text>
</b-card>
</template>

<script>
export default {
  name: 'HashrateChartWrapper',
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
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
      data: [],
      resolution: options[0].value,
      options,
      loading: true,
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
  },
  mounted() {
    this.load()
    this.$root.$on('bv::refresh::charts', unit => {
      if(unit === this.unit) {
        this.load()
      }
    })
  },
  watch: {
    resolution() {
      this.load()
    }
  },
  methods: {
    load() {
      this.loading = true
      const method = this.type.startsWith('user') ? this.$user.getGraph : this.$api.getGraph
      method(this.type, this.resolution).then(data => {
        this.loading = false
        this.data = data.data
      }).catch(() => {
      })
    }
  },
}
</script>
