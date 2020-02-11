import config from '@/../config.json'
import { Logger, Api, User } from '@/modules'

let logger, api, user

export default ({ Vue, app, store, router }) => {

  Vue.prototype.$config = config
  store.commit('setConfig', config)

  logger = new Logger()
  Vue.prototype.$logger = logger

  api = new Api({ app, store })
  Vue.prototype.$api = api

  user = new User({ store, router })
  Vue.prototype.$user = user

}

export { config, logger, api, user }
