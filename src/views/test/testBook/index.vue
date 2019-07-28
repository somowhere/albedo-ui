<template>
  <div class="app-container calendar-list-container">
    <basic-container>
    <div class="filter-container">
      <el-form :inline="true"  :model="listQuery" ref="searchTestBookForm" v-show="searchFilterVisible">
        <el-form-item label="标题" prop="title">
          <el-input class="filter-item input-normal" v-model="listQuery.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input class="filter-item input-normal" v-model="listQuery.author"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input class="filter-item input-normal" v-model="listQuery.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button size="small" @click="searchReset" icon="el-icon-delete" >清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格功能列 -->
    <div class="table-menu">
      <div class="table-menu-left">
        <el-button-group>
          <el-button size="mini" v-if="test_testBook_edit" class="filter-item" @click="handleEdit" type="primary" icon="edit">添加</el-button>
        </el-button-group>
      </div>
      <div class="table-menu-right">
        <el-button icon="el-icon-search" circle size="mini" @click="searchFilterVisible= !searchFilterVisible"></el-button>
      </div>
    </div>
    <el-table :key='tableKey' @sort-change="sortChange" :data="list" v-loading="listLoading" element-loading-text="加载中..." fit highlight-current-row>
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作者">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="activated_">
        <template slot-scope="scope">
          <span>{{scope.row.activated}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="key">
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="money_">
        <template slot-scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="amount_">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="reset_date">
        <template slot-scope="scope">
          <span>{{scope.row.resetDate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" v-if="test_testBook_edit || test_testBook_del">
        <template slot-scope="scope">
          <el-button v-if="test_testBook_edit" icon="icon-edit" title="编辑" type="text" @click="handleEdit(scope.row)">
          </el-button>
          <el-button v-if="test_testBook_del" icon="icon-delete" title="删除" type="text" @click="handleDelete(scope.row)">
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="100px">
      <el-table-column type="index" fixed="left" width="60"></el-table-column>
        <el-form-item label="标题" prop="title" :rules="[{min: 0,max: 32,message: '长度在 0 到 32 个字符'},]">
                <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author" :rules="[{required: true,message: '请输入作者'},{min: 0,max: 50,message: '长度在 0 到 50 个字符'},]">
                <el-input v-model="form.author"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[{min: 0,max: 50,message: '长度在 0 到 50 个字符'},{validator:validateUnique}]">
                <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :rules="[{min: 0,max: 100,message: '长度在 0 到 100 个字符'},]">
                <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone" :rules="[{min: 0,max: 32,message: '长度在 0 到 32 个字符'},]">
                <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="activated_" prop="activated" :rules="[{required: true,message: '请输入activated_'},{validator:validateDigits},]">
              <CrudRadio v-model="form.activated" :dic="activatedOptions"></CrudRadio>
        </el-form-item>
        <el-form-item label="key" prop="number" :rules="[{validator:validateDigits},]">
                <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="money_" prop="money" :rules="[{ validator:validateNumber},]">
                <el-input v-model="form.money"></el-input>
        </el-form-item>
        <el-form-item label="amount_" prop="amount" :rules="[{ validator:validateNumber},]">
                <el-input v-model="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="reset_date" prop="resetDate" :rules="[]">
              <el-date-picker v-model="form.resetDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" >
              </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="description" :rules="[{min: 0,max: 255,message: '长度在 0 到 255 个字符'},]">
                <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button size="small" type="primary" @click="save()">保 存</el-button>
      </div>
    </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { pageTestBook, findTestBook, saveTestBook, removeTestBook, validateUniqueTestBook} from "./service";
import { mapGetters } from "vuex";
import {isValidateUnique, isValidateNumber, isValidateDigits, objectToString, validateNull} from "@/util/validate";
import {parseJsonItemForm} from "@/util/util";
import CrudSelect from "@/views/avue/crud-select";
import CrudCheckbox from "@/views/avue/crud-checkbox";
import CrudRadio from "@/views/avue/crud-radio";

export default {
  name: "table_test_testBook",
  components: {CrudSelect, CrudCheckbox, CrudRadio},
  data() {
    return{
      searchFilterVisible: true,
      dialogFormVisible: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20
      },
      form: {
        title: undefined,
        author: undefined,
        name: undefined,
        email: undefined,
        phone: undefined,
        activated: undefined,
        number: undefined,
        money: undefined,
        amount: undefined,
        resetDate: undefined,
        description: undefined,
      },
      validateUnique: (rule, value, callback) => {
          validateUniqueTestBook(rule, value, callback, this.form.id)
        },
        validateNumber: (rule, value, callback) => {
          isValidateNumber(rule, value, callback)
        },
        validateDigits: (rule, value, callback) => {
          isValidateDigits(rule, value, callback)
        },
      activatedOptions: undefined,
      delFlagOptions: undefined,
      dialogStatus: 'create',
      textMap: {
        update: '编辑测试书籍',
        create: '创建测试书籍'
      },
      tableKey: 0
    };
  },
  computed: {
    ...mapGetters(["permissions","dicts"])
  },
  filters: {
  },
  created() {
    this.getList();
    this.test_testBook_edit = this.permissions["test_testBook_edit"];
    this.test_testBook_del = this.permissions["test_testBook_del"];
    this.activatedOptions = this.dicts["sys_flag"];
    this.delFlagOptions = this.dicts["sys_flag"];
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.queryConditionJson = parseJsonItemForm([
      {fieldName: 'title',value:this.listQuery.title,operate:'like',attrType:'String'},
      {fieldName: 'author',value:this.listQuery.author,operate:'like',attrType:'String'},
      {fieldName: 'name',value:this.listQuery.name,operate:'like',attrType:'String'},
      ])
      pageTestBook(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    sortChange(column){
      if(column.order=="ascending"){
        this.listQuery.ascs=column.prop
        this.listQuery.descs=undefined;
      }else{
        this.listQuery.descs=column.prop
        this.listQuery.ascs=undefined;
      }
      this.getList()
    },
    searchReset() {
      this.$refs['searchTestBookForm'].resetFields();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleEdit(row) {
      this.resetForm();
      this.dialogStatus = row && !validateNull(row.id)? "update" : "create";
      if(this.dialogStatus == "create"){
        this.dialogFormVisible = true;
      }else{
        findTestBook(row.id).then(response => {
            this.form = response.data;
            this.form.activated=objectToString(this.form.activated);
            this.form.delFlag=objectToString(this.form.delFlag);
            this.disableSelectTestBookParent = this.form.parentName ? false : true;
            this.dialogFormVisible = true;
          });
      }
    },
    cancel() {
      this.dialogFormVisible = false;
      this.$refs['form'].resetFields();
    },
    save() {
      const set = this.$refs;
      set['form'].validate(valid => {
        if (valid) {
          saveTestBook(this.form).then((data) => {
            this.getList();
            this.cancel()
          });
        } else {
          return false;
        }
      });
    },
    handleDelete(row) {
      this.$confirm(
        "此操作将永久删除该测试书籍, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        removeTestBook(row.id).then((data) => {
            this.getList();
          });
      });
    },
    resetForm() {
      this.form = {
        title: "",
        author: "",
        name: "",
        email: "",
        phone: "",
        activated: "",
        number: "",
        money: "",
        amount: "",
        resetDate: "",
        description: "",
      };
      this.$refs['form']&&this.$refs['form'].resetFields();
    }
  }
};
</script>
