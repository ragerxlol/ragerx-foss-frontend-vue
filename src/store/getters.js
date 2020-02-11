export function get_pplns_window(state) {

  if(state.stats.pool_info.pplns_window == 0) {
    return 'N/A'
  }

  // below is easiest way to turn seconds into DD:HH:MM:SS and split into an array
  let ago = new Date(state.stats.pool_info.pplns_window_relative * 1000).toISOString().substr(8, 11).replace('T', ':').split(':')
  let units = ['day', 'hour', 'minute', 'second']

  // subtract one day from pplns window (Jan 1)
  ago[0]--

  while(ago[0] == 0 && ago.length) {
    ago.shift()
    units.shift()
  }

  for(let i = 0; i < ago.length; i++) {
    ago[i] = +ago[i] + ' ' + ( ago[i] == 1 ? units[i] : units[i] + 's' )
  }

  return ago.join(', ')
}
