<script>
import * as moment from 'moment'
import { Bar, mixins } from 'vue-chartjs'

Chart.Tooltip.positioners.custom = (elements, eventPosition) => {
  return {
    x: eventPosition.x,
    y: eventPosition.y
  }
}

export default {
  extends: Bar,
  name: 'BlockGraph',
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
      }
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
              unit: this.unit,
            },
            display: true,
            offset: true,
            gridLines: {
              display: false
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 24,
            }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display: false
            },
            ticks: {
              suggestedMin: 0
            }
          }]
        },
        tooltips: {
          mode: 'point',
          position : 'custom',
          enabled: false,
          custom: (tooltipModel) => {
            let parentEl = this.$data._chart.canvas.parentElement
            let tooltipEl = parentEl.querySelector('.blocks-tooltip')
            if(!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.className = 'blocks-tooltip'
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
              let format = 'MMM Do'
              if(this.unit === 'hour') {
                format += ', h A'
              }
              const title = moment(tooltipModel.title[0]).format(format)
              const body = tooltipModel.body[0].lines[0]
              tooltipEl.innerHTML = `${title}<br/>Blocks found: ${body}`
            }

            tooltipEl.style.opacity = 1

            const y = this.$data._chart.canvas.offsetTop + tooltipModel.caretY
            let x = this.$data._chart.canvas.offsetLeft + tooltipModel.caretX

            if(tooltipModel.caretX > this.$data._chart.canvas.offsetWidth / 2) {
              x -= tooltipEl.offsetWidth
            }
            tooltipEl.style.transform = `translate(${x}px, ${y}px)`
          }
        },
      }
    },
    chartData() {
      return {
        datasets: [
          {
            data: this.data,
            borderWidth: 1,
            borderColor: this.colors.primary,
            backgroundColor: this.colors.primary,
          },
        ]
      }
    },
  },
  methods: {
    render() {
      this.renderChart(this.chartData, this.options)
    }
  },
  mounted() {
    this.render()
  },
  watch: {
    chartData() {
      if(this.$refs.canvas.clientWidth !== 0 && this.$refs.canvas.clientHeight !== 0) {
        this.$data._chart.destroy()
        this.render()
      }
    }
  }
}
</script>

<style lang="scss">
.blocks-tooltip {
    background: var(--chart-tooltip);
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    will-change: transform, opacity;
    padding: 5px;
    pointer-events: none;
}
</style>
