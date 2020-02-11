const config = require('./config.json')


module.exports = {
  chainWebpack: (cfg) => {
    cfg
      .plugin('html')
      .tap((args) => {
        args[0].title = config.general.pool_name
        return args
      })
  }
}
