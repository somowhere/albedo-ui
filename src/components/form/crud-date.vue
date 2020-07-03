<template>
  <el-date-picker
    v-model="text"
    :disabled="disabled"
    :format="format"
    :placeholder="placeholder?placeholder:`请输入${label}`"
    :size="size"
    :type="type"
    :value-format="valueFormat"
    @change="handleChange"
  />
</template>

<script>
export default {
  name: 'CrudDate',
  props: {
    value: {
      default: ''
    },
    type: {
      default: 'date'
    },
    valueFormat: {
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    format: {
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      text: ''
    }
  },
  watch: {
    value: function(n, o) {
      this.text = this.value
    }
  },
  created() {
    this.text = this.value
  },
  mounted() {
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>
</style>
