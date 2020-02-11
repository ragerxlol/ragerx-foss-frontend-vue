import { axios } from '@/plugins/axios'
import { config, logger } from '@/plugins/init'
import { validate } from 'cryptonote-address-validator'

const API_URL = config.api.url

export default class User {
  constructor({ router, store }) {
    this.router = router
    this.store = store

    this.interval = null
    this.startPolling()
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
    const token = localStorage.getItem('jwt')
    if(!token) {
      return
    }
    const headers = {
      'x-jwt-token': token
    }
    axios.get(`${API_URL}/user/stats`, { headers }).then(response => {
      this.store.commit('setUserStats', response.data)
      this.store.commit('setInit', 'user')
      if(this.router.currentRoute.name === 'login') {
        this.router.push({ name: 'user-dashboard' }).catch(error => { console.log(error) })
      }
    }).catch(error => {
      logger.error('user', 'Error getting stats')
      logger.error('user', error)
      if(error.response.data.error && error.response.data.message === 'ERR_INVALID_TOKEN') {
        this.logout()
      }
    })
  }

  login(username, password) {
    logger.info('user', 'Attempting to login with username %s', [username])
    return axios.post(`${API_URL}/user/login`, { username, password }).then(response => {
      const [ data, token ] = response.data
      localStorage.setItem('jwt', token)
      this.store.commit('setInit', 'user')
      this.store.commit('setUserStats', data)
      this.router.push({ name: 'user-dashboard' }).catch(() => {})
      return {}
    }).catch(error => {
      logger.error('user', 'Error logging in')
      logger.error('user', error)
      return error.response.data
    })
  }

  register(username, password, wallet) {
    logger.info('user', 'Attempting to register with username %s', [username])
    return axios.post(`${API_URL}/user/register`, { username, password, wallet }).then(response => {
      const [ data, token ] = response.data
      localStorage.setItem('jwt', token)
      this.store.commit('setInit', 'user')
      this.store.commit('setUserStats', data)
      this.router.push({ name: 'user-dashboard' }).catch(() => {})
      return {}
    }).catch(error => {
      logger.error('user', 'Error registering')
      logger.error('user', error)
      return error.response.data
    })
  }

  logout() {
    logger.info('user', 'Logging out')
    localStorage.removeItem('jwt')
    this.store.commit('unsetInit', 'user')
    this.store.commit('setUserStats', {})
    this.router.push({ name: 'login' }).catch(() => {})
  }

  saveSettings(settings) {
    const headers = {
      'x-jwt-token': localStorage.getItem('jwt')
    }
    logger.info('user', 'Attempting to save settings')
    return axios.post(`${API_URL}/user/settings`, settings, { headers }).then(response => {
      this.store.commit('setUserSettings', response.data)
      return {}
    }).catch(error => {
      logger.error('user', 'Error saving settings')
      logger.error('user', error)
      return error.response.data
    })
  }

  getCreditsDebits(page) {
    const headers = {
      'x-jwt-token': localStorage.getItem('jwt')
    }
    logger.info('user', 'Getting credits/debits table page %d', [page])
    return axios.get(`${API_URL}/user/credits_debits?page=${page}`, { headers }).then(response => {
      return response.data
    }).catch(error => {
      logger.error('user', 'Error getting credits/debits table')
      logger.error('user', error)
      throw error
    })
  }

  getGraph(type, resolution) {
    const headers = {
      'x-jwt-token': localStorage.getItem('jwt')
    }
    logger.info('user', 'Getting graph type %s %s', [type, resolution])
    return axios.get(`${API_URL}/user/graphs?type=${type}&resolution=${resolution}`, { headers }).then(response => {
      return response.data
    }).catch(error => {
      logger.error('user', 'Error getting graph')
      logger.error('user', error)
      throw error
    })
  }

  // Basic Validations, full validation happens on backend
  validateUsername(username) {
    return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){2,38}$/i.test(username)
  }
  validatePassword(password) {
    return password.length >= 8
  }
  validateConfirmPassword(password, confirm_password) {
    return password === confirm_password
  }
  validateAddress(address) {
    return validate(address, this.store.state.stats.coin.address_prefixes).valid
  }
}
