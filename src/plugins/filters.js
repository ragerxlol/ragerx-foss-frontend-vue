import Vue from 'vue'
import store from '@/store'

import { formatDistanceToNow, formatDistance } from 'date-fns'

Vue.filter('money', (value) => {
  return `${value / store.state.stats.coin.coin_units} ${store.state.stats.coin.coin_symbol}`
})

Vue.filter('fixedMoney', (value, precision=null) => {
  if(precision === null) {
    precision = store.state.stats.coin.coin_units.toString().length - 1
  }
  return `${(value / store.state.stats.coin.coin_units).toFixed(precision)} ${store.state.stats.coin.coin_symbol}`
})

Vue.filter('mul1000', (value) => {
  return value * 1000
})

Vue.filter('percentage', (val, precision=0) => {
  return (val * 100).toFixed(precision) + '%'
})

Vue.filter('commas', (num) => {
  if(num) {
    let str = num.toString().split('.')
    if(str[0].length >= 4) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    }
    return str.join('.')
  }
  return 0
})

Vue.filter('distanceInWords', (value) => {
  return formatDistanceToNow(value, { addSuffix: true, includeSeconds: true })
})

Vue.filter('distanceInterval', (value) => {
  return formatDistance(0, value, { includeSeconds: true })
})

Vue.filter('date', (value) => {
  let date = new Date(value)
  return date.toLocaleDateString()
})

Vue.filter('time', (value) => {
  let date = new Date(value)
  return date.toLocaleString()
})

Vue.filter('minutes', (val) => {
  if(val == null) {
    return 'Never'
  }
  return val / 60 + ' minutes'
})

Vue.filter('hashrate', (hashrate, precision=2) => {
  if(!hashrate) hashrate = 0
  const byteUnits = [' H/s', ' kH/s', ' MH/s', ' GH/s', ' TH/s', ' PH/s']
  let i = 0
  if(hashrate > 0) {
    while(hashrate > 1000) {
      hashrate /= 1000
      i++
    }
  }
  if(i === 0) {
    precision = 0
  }
  return parseFloat(hashrate).toFixed(precision) + byteUnits[i]
})
