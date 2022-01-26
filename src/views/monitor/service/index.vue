<template>
  <elFrame :src="serviceApi" />
</template>
<script>
import { mapGetters } from 'vuex'
import elFrame from '@/components/Iframe/index'
export default {
  name: 'Service',
  components: { elFrame },
  computed: {
    ...mapGetters([
      'serviceApi'
    ])
  }
}
</script>
