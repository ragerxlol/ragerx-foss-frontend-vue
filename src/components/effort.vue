<template>
<span :class="className">
  {{ value | percentage(1) }}
</span>
</template>

<script>
export default {
  name: 'Effort',
  props: {
    value: {
      required: true
    }
  },
  computed: {
    className() {
      if(this.value <= 1) {
        return 'text-success'
      } else if(this.value <= 1.5) {
        return 'text-warning'
      } else {
        return 'text-danger'
      }
    }
  }
}
</script>
