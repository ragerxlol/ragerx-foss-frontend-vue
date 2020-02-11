<script>
import * as moment from 'moment'
import { Line, mixins } from 'vue-chartjs'

Chart.Tooltip.positioners.custom = (elements, eventPosition) => {
  return {
    x: eventPosition.x,
    y: eventPosition.y
  }
}

export default {
  extends: Line,
  name: 'HashrateChart',
  props: {
    data: {
      type: Array,
      default: []
    },
    unit: {
      type: String,
      default: 'day'
    }
  },
  data () {
    const root = getComputedStyle(document.documentElement)
    return {
      colors: {
        primary: root.getPropertyValue('--chart-primary').trim(),
        secondary: root.getPropertyValue('--chart-secondary').trim(),
        label: root.getPropertyValue('--chart-label').trim(),
        grid: root.getPropertyValue('--chart-grid').trim(),
      },
      gradient: null
    }
  },
  computed: {
    options() {
      return {
        animation: false,
        legend: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              parser: function(time) {
                return moment.unix(time)
              }
            },
            gridLines : {
              display : false
            },
            ticks: {
              fontColor: this.colors.label,
              autoSkip: true,
              maxTicksLimit: 24,
            }
          }],
          yAxes: [{
            gridLines : {
              color: this.colors.grid,
            },
            ticks: {
              fontColor: this.colors.label,
              suggestedMin: 0,
              suggestedMax: 100,
              userCallback: val => this.$options.filters.hashrate(val, 1)
            }
          }]
        },
        elements: {
          line: {
            tension: 0,
            borderWidth: 1,
          },
          point: {
            radius: 0,
            hitRadius: 5,
            hoverRadius: 0,
          }
        },
        customLine: {
          color: this.colors.label,
        },
        tooltips: {
          mode: 'x',
          intersect: false,
          position : 'custom',
          enabled: false,
          custom: function(tooltipModel) {
            let parentEl = this._chart.canvas.parentElement
            let tooltipEl = parentEl.querySelector('.hashrate-tooltip')
            if(!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.className = 'hashrate-tooltip'
              parentEl.appendChild(tooltipEl)
            }
            if(tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0
              return
            }
            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if(tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }
            if(tooltipModel.body) {
              const title = tooltipModel.title[0]
              const body = tooltipModel.body[0].lines[0]
              tooltipEl.innerHTML = `${title}<br/>${body}`
            }

            tooltipEl.style.opacity = 1

            const y = this._chart.canvas.offsetTop + tooltipModel.caretY
            let x = this._chart.canvas.offsetLeft + tooltipModel.caretX

            if(tooltipModel.caretX > this._chart.canvas.offsetWidth / 2) {
              x -= tooltipEl.offsetWidth
            }
            tooltipEl.style.transform = `translate(${x}px, ${y}px)`
          },
          callbacks: {
            label: (tooltipItem, data) => {
              const index = tooltipItem.index
              const hashrate = this.$options.filters.hashrate(this.chartData.datasets[1].data[index].y, 2)
              const hashrate_avg = this.$options.filters.hashrate(this.chartData.datasets[0].data[index].y, 2)
              return `<span class="hashrate">${hashrate}</span><br/><span class="average">${hashrate_avg}</span>`
            },
          }
        },
      }
    },
    chartData() {
      const average1 = this.zlema(this.data, 12)
      const average2 = this.zlema(this.data, 50)
      // const average2 = this.ema(average1, 20)
      return {
        datasets: [
          {
            fill: false,
            borderColor: this.colors.secondary,
            borderWidth: 1.5,
            data: average2,
          },
          {
            borderColor: this.colors.primary,
            backgroundColor: this.gradient,
            data: average1
          },
        ]
      }
    },
  },
  methods: {
    zlema(data, period) {
      const lag = (period - 1) / 2
      let delagged = []
      for(let i = 0; i < data.length; i++) {
        let lagago
        if(lag !== Math.floor(lag)) {
          // if lag is not a whole number, average the two closest points
          const lagago_index_low = Math.max(i - Math.floor(lag), 0)
          const lagago_index_high = Math.max(i - Math.ceil(lag), 0)
          lagago = ( data[lagago_index_low].y + data[lagago_index_high].y ) / 2
        } else {
          const lagago_index = Math.max(i - lag, 0) // min 0 in case we don't have enough points ago
          lagago = data[lagago_index].y
        }
        delagged.push({
          t: data[i].t,
          y: data[i].y + data[i].y - lagago
        })
      }
      return this.ema(delagged, period)
    },
    ema(data, period) {
      const k = 2 / (period + 1)
      let average = [data[0]]
      for(let i = 1; i < data.length; i++) {
        average.push({
          t: data[i].t,
          y: Math.max(data[i].y * k + average[i - 1].y * (1 - k), 0)
        })
      }
      return average
    },
    render() {
      let min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY
      for(let i = 0; i < this.chartData.datasets[0].data.length; i++) {
        const val = this.chartData.datasets[0].data[i].y
        if(val < min) {
          min = val
        }
        if(val > max) {
          max = val
        }
      }

      min = min === Number.POSITIVE_INFINITY ? 0 : Math.max(min - 100, 0)
      max = max === Number.NEGATIVE_INFINITY ? 100 : max + 100

      // this.options.scales.yAxes[0].ticks.suggestedMin = min
      this.options.scales.yAxes[0].ticks.suggestedMin = 0
      this.options.scales.yAxes[0].ticks.suggestedMax = max

      this.options.scales.xAxes[0].time.unit = this.unit

      this.renderChart(this.chartData, this.options)
    }
  },
  mounted () {

    let primary_color_components = { r: 255, g: 255, b: 255 }

    if(this.colors.primary.length === 6 + 1) {
      const groups = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.colors.primary)
      if(groups) {
        primary_color_components = {
          r: parseInt(groups[1], 16),
          g: parseInt(groups[2], 16),
          b: parseInt(groups[3], 16)
        }
      }
    } else if(this.colors.primary.length === 3 + 1) {
      const groups = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(this.colors.primary)
      if(groups) {
        primary_color_components = {
          r: parseInt(groups[1], 16),
          g: parseInt(groups[2], 16),
          b: parseInt(groups[3], 16)
        }
      }
    }

    this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 400)
    this.gradient.addColorStop(0, `rgba(${Object.values(primary_color_components)}, 0.5)`) // 50% alpha
    this.gradient.addColorStop(1, `rgba(${Object.values(primary_color_components)}, 0)`) //  0% alpha

    this.addPlugin({
      beforeEvent: function(chart, e) {
        if((e.type === 'mousemove') && (e.x >= e.chart.chartArea.left) && (e.x <= e.chart.chartArea.right)) {
          chart.options.customLine.x = e.x
        }
      },
      afterDraw: function(chart, easing) {
        const ctx = chart.chart.ctx
        const chartArea = chart.chartArea
        const x = chart.options.customLine.x

        if(!isNaN(x)) {
          ctx.save()
          ctx.strokeStyle = chart.options.customLine.color
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(chart.options.customLine.x, chartArea.bottom)
          ctx.lineTo(chart.options.customLine.x, chartArea.top)
          ctx.stroke()
          ctx.restore()
        }
      }
    })
    this.render()
  },
  activated() {
    if(this.$refs.canvas.clientWidth !== 0 && this.$refs.canvas.clientHeight !== 0) {
      this.$data._chart.destroy()
      this.render()
    }
  },
  watch: {
    chartData () {
      if(this.$refs.canvas.clientWidth !== 0 && this.$refs.canvas.clientHeight !== 0) {
        this.$data._chart.destroy()
        this.render()
      }
    }
  }
}
</script>

<style lang="scss">
.hashrate-tooltip {
    background: var(--chart-tooltip);
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    will-change: transform, opacity;
    padding: 5px;
    pointer-events: none;
}

.hashrate-tooltip span:before {
    content: "";
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 5px;
}

.hashrate-tooltip .hashrate:before {
    background: var(--chart-primary);
}

.hashrate-tooltip .average:before {
    background: var(--chart-secondary);
}
</style>
