<template>
  <el-select
    v-model="text"
    style="width: 100%"
    :clearable="clearable"
    :disabled="disabled"
    :filterable="filterable"
    :multiple="multiple"
    :placeholder="placeholder?placeholder:`请选择${label}`"
    :size="size"
    @change="handleChange"
  >
    <el-option v-for="(item,index) in dic" :key="index" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script>
export default {
  name: 'CrudSelect',
  props: {
    value: {
      default() {
        return this.multiple ? [] : ''
      }
    },
    // multiple: {
    //   type: Function,
    //   default: false
    // },
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
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
