<template>
<div>
  <pre>{{ state }}</pre>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'debug',
  computed: {
    ...mapState({
      state: state => state
    })
  },
}
</script>
