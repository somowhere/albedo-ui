<template>
  <el-checkbox-group v-model="text" @change="handleChange">
    <el-checkbox v-for="(item,index) in dic" :key="index" :label="item.value">{{ item.label }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  name: 'CrudCheckbox',
  props: {
    value: {
      default: () => {
        return []
      }
    },
    dic: {
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      text: []
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
