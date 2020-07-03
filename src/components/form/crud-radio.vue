<template>
  <el-radio-group v-model="text" :disabled="disabled" @change="handleChange">
    <el-radio v-for="(item,index) in dic" :key="index" :label="item.value">{{ item.label }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'CrudRadio',
  props: {
    value: {
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dic: {
      default: () => {
        return []
      }
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
