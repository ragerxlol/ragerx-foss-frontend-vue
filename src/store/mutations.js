export function setInit(state, type) {
  state.init[type] = true
}
export function unsetInit(state, type) {
  state.init[type] = false
}
export function setConfig(state, config) {
  state.config = config
}
export function setStats(state, stats) {
  state.stats = stats
}
export function setUserStats(state, stats) {
  state.user = stats
}
export function setUserSettings(state, settings) {
  Object.assign(state.user.info, settings)
}
