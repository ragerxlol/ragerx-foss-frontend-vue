import { axios } from '@/plugins/axios'
import { config, logger } from '@/plugins/init'

const API_URL = config.api.url

export default class Api {
  constructor({ app, store }) {
    this.app = app
    this.store = store

    this.interval = null
    this.startPolling()

    // The event counter is a simple incrementing
    // value everytime the specified event occurs
    // This is used to that the frontend can call
    // endpoints only when the api has updated
    this.event_counter = {
      '1m': 0,
      '5m': 0,
      '1hr': 0,
      block: 0,
    }
  }

  startPolling() {
    this.getStats()

    if(this.interval) {
      clearInterval(this.interval)
    }
    this.interval = setInterval(() => {
      this.getStats()
    }, config.api.polling_interval * 1000)
  }

  getStats() {
    return axios.get(`${API_URL}/global/stats`).then(response => {
      this.store.commit('setStats', response.data)
      this.dispatchEvents(response.data.events)
      this.store.commit('setInit', 'global')
    }).catch(error => {
      logger.error('network', 'Error getting stats')
      logger.error('network', error)
    })
  }

  dispatchEvents(events) {
    if(events['1m'] !== this.event_counter['1m']) {
      // Nothing to do here
    }
    if(events['5m'] !== this.event_counter['5m']) {
      // Update hashrate graphs on 24hr
      this.app.$emit('bv::refresh::charts', 'hour')
    }
    if(events['1hr'] !== this.event_counter['1hr']) {
      // Update hashrate graphs on 7d or 30d
      this.app.$emit('bv::refresh::charts', 'day')
    }
    if(events.block !== this.event_counter.block) {
      // Update blocks, payments, and credits/debits table
      this.app.$emit('bv::refresh::table', 'blocks-table')
      this.app.$emit('bv::refresh::table', 'payouts-table')
      this.app.$emit('bv::refresh::table', 'credits-debits-table')
    }
    this.event_counter = events
  }

  getBlocks(page) {
    logger.info('network', 'Getting blocks table page %d', [page])
    return axios.get(`${API_URL}/global/blocks?page=${page}`).then(response => {
      return response.data
    }).catch(error => {
      logger.error('network', 'Error getting blocks table')
      logger.error('network', error)
      throw error
    })
  }

  getPayments(page) {
    logger.info('network', 'Getting payments table page %d', [page])
    return axios.get(`${API_URL}/global/payments?page=${page}`).then(response => {
      return response.data
    }).catch(error => {
      logger.error('network', 'Error getting payments table')
      logger.error('network', error)
      throw error
    })
  }

  getGraph(type, resolution) {
    logger.info('network', 'Getting graph type %s %s', [type, resolution])
    return axios.get(`${API_URL}/global/graphs?type=${type}&resolution=${resolution}`).then(response => {
      return response.data
    }).catch(error => {
      logger.error('network', 'Error getting graph')
      logger.error('network', error)
      throw error
    })
  }

}
