<template>
  <div>
    <!--左侧插槽-->
    <slot name="left" />
    <el-button
      v-if="crud.optShow.edit"
      v-permission="permission.edit"
      :disabled="disabledEdit"
      :loading="crud.status.cu === 2"
      icon="el-icon-edit"
      plain
      size="mini"
      type="primary"
      @click="crud.toEdit(data)"
    />
    <el-popover
      v-if="crud.optShow.del"
      v-model="pop"
      v-permission="permission.del"
      placement="top"
      trigger="manual"
      width="180"
      @hide="onPopoverHide"
      @show="onPopoverShow"
    >
      <p>{{ msg }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="doCancel">取消</el-button>
        <el-button
          :loading="crud.dataStatus[crud.getDataId(data)].delete === 2"
          plain
          size="mini"
          type="primary"
          @click="crud.doDelete(data)"
        >确定
        </el-button>
      </div>
      <el-button
        slot="reference"
        :disabled="disabledDle"
        icon="el-icon-delete"
        plain
        size="mini"
        type="danger"
        @click="toDelete"
      />
    </el-popover>
    <!--右侧-->
    <slot name="right" />
  </div>
</template>
<script>
import CRUD, { crud } from '@/views/components/Crud/crud'

export default {
  mixins: [crud()],
  props: {
    data: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    },
    disabledEdit: {
      type: Boolean,
      default: false
    },
    disabledDle: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: '确定删除本条数据吗？'
    }
  },
  data() {
    return {
      pop: false
    }
  },
  methods: {
    doCancel() {
      this.pop = false
      this.crud.cancelDelete(this.data)
    },
    toDelete() {
      this.pop = true
    },
    [CRUD.HOOK.afterDelete](crud, data) {
      if (data === this.data) {
        this.pop = false
      }
    },
    onPopoverShow() {
      setTimeout(() => {
        document.addEventListener('click', this.handleDocumentClick)
      }, 0)
    },
    onPopoverHide() {
      document.removeEventListener('click', this.handleDocumentClick)
    },
    handleDocumentClick(event) {
      this.pop = false
    }
  }
}
</script>
