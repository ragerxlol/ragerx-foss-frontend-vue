export default class Logger {

  constructor() {
    console.log("%cSTOP!", "color: red; font-size: 48px")
    console.log("%cThis is a browser feature intended for developers. If some one told you to copy-paste something here, it is a scam and will give them access to your funds.", "font-weight:bold; font-size: 14px;")
  }

  emoji(emoji) {
    switch(emoji) {
        case 'network':
          return '📡'
        case 'user':
          return '👤'
        case 'computer':
          return '💻'
    }
  }
  warn(emoji, message, params=[]) {
    console.warn(`${this.emoji(emoji)} ${message}`, ...params)
  }
  info(emoji, message, params=[]) {
    console.info(`${this.emoji(emoji)} ${message}`, ...params)
  }
  error(emoji, message, params=[]) {
    console.error(`${this.emoji(emoji)} ${message}`, ...params)
  }
  log(emoji, message, params=[]) {
    console.log(`${this.emoji(emoji)} ${message}`, ...params)
  }
}
