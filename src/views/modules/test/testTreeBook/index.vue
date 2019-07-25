<template>
  <div class="app-container calendar-list-container">
    <basic-container>
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>测试树书</span>
            <el-button type="text" style="float: right; padding: 3px 0" icon="icon-filesearch" title="搜索" @click="searchTree=(searchTree ? false:true)"></el-button>
            <el-button type="text" style="float: right; padding: 3px 0" icon="icon-reload" title="刷新" @click="getTree()"></el-button>
          </div>
          <el-input v-show="searchTree"
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            class="filter-tree"
            :data="treeData"
            ref="leftTree"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-click="getNodeData">
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="19">
        <div class="filter-container">
            <el-form :inline="true">
              <el-form-item label="parent_id">
                    <el-input class="filter-item input-normal" v-model="listQuery.parentId"></el-input>
              </el-form-item>
              <el-form-item label="部门名称">
                    <el-input class="filter-item input-normal" v-model="listQuery.name"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                <el-button v-if="test_testTreeBook_edit" class="filter-item" style="margin-left: 10px;" @click="handleEdit" type="primary" icon="edit">添加</el-button>
              </el-form-item>
            </el-form>
        </div>
        <el-table :data="list" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row style="width: 99%">
          <el-table-column align="center" label="部门名称">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="排序">
            <template slot-scope="scope">
              <span>{{scope.row.sort}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="1 叶子节点 0 非叶子节点">
            <template slot-scope="scope">
              <span>{{scope.row.leaf}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" v-if="test_testTreeBook_edit || test_testTreeBook_lock || test_testTreeBook_delete">
            <template slot-scope="scope">
            <el-button v-if="test_testTreeBook_edit" icon="icon-edit" title="编辑" type="text" @click="handleEdit(scope.row)">
            </el-button>
            <el-button v-if="test_testTreeBook_lock" :icon="scope.row.status=='正常' ? 'icon-lock' : 'icon-unlock'" :title="scope.row.status=='正常' ? '锁定' : '解锁'" type="text" @click="handleLock(scope.row)">
            </el-button>
            <el-button v-if="test_testTreeBook_delete" icon="icon-delete" title="删除" type="text" @click="handleDelete(scope.row)">
            </el-button>
            </template>
          </el-table-column>

        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
      </el-col>
    </el-row>
    <el-dialog title="选择测试树书" :visible.sync="dialogTestTreeBookVisible">
      <el-input placeholder="输入关键字进行过滤"
                v-model="filterFormText">
      </el-input>
      <el-tree class="filter-tree" ref="formTree" :data="treeTestTreeBookData"
               check-strictly node-key="id" highlight-current @node-click="getNodeFormData"
               :filter-node-method="filterNode" default-expand-all>
      </el-tree>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
        <el-form-item label="上级测试树书" prop="parentName">
          <el-input v-model="form.parentName" placeholder="选择测试树书" @focus="handleTestTreeBook()" readonly></el-input>
          <input type="hidden" v-model="form.parentId" />
        </el-form-item>
        <el-form-item label="部门名称" prop="name" :rules="[{min: 0,max: 50,message: '长度在 0 到 50 个字符'},{validator:validateUnique}]">
                <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort" :rules="[{validator:validateDigits},{min: 0,max: 11,message: '长度在 0 到 11 个字符'},]">
                <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="description" :rules="[{min: 0,max: 100,message: '长度在 0 到 100 个字符'},]">
                <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="save()">保 存</el-button>
      </div>
    </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import {fetchTestTreeBookTree, findTestTreeBook, saveTestTreeBook, removeTestTreeBook, pageTestTreeBook} from "./service";
  import { mapGetters } from 'vuex'
  import {parseJsonItemForm, parseTreeData} from "@/util/util";
  import {dictCodes} from "@/api/dataSystem";
  import {isValidateUnique, isValidateNumber, isValidateDigits, objectToString, toStr, validateNotNull} from "@/util/validate";
  import {MSG_TYPE_SUCCESS} from "@/const/common";
  export default {
    name: 'module',
    data() {
      return {
        treeTestTreeBookData: [],
        dialogTestTreeBookVisible: false,
        dialogFormVisible: false,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          size: 20
        },
        formEdit: true,
        filterText: '',
        filterFormText: '',
        formStatus: '',
        statusOptions: [],
        typeOptions: [],
        methodOptions: [],
        searchTree: false,
        treeData: [],
        labelPosition: 'right',
        form: {
        name: undefined,
        sort: undefined,
        description: undefined,
        },
        validateUnique: (rule, value, callback) => {
          isValidateUnique(rule, value, callback, '/test/testTree/checkByProperty?id='+toStr(this.form.id))
        },
        validateNumber: (rule, value, callback) => {
          isValidateNumber(rule, value, callback)
        },
        validateDigits: (rule, value, callback) => {
          isValidateDigits(rule, value, callback)
        },
        dialogStatus: 'create',
        textMap: {
          update: '编辑测试树书',
          create: '创建测试树书'
        },
        currentNode: {}
      }
    },
    watch: {
      filterText(val) {
        this.$refs['leftTree'].filter(val);
      },
      filterFormText(val) {
        this.$refs['formTree'].filter(val);
      }
    },
    created() {
      this.getTree()
      this.getList()
      this.test_testTreeBook_edit = this.authorities.indexOf("test_testTreeBook_edit") !== -1;
      this.test_testTreeBook_lock = this.authorities.indexOf("test_testTreeBook_lock") !== -1;
      this.test_testTreeBook_delete = this.authorities.indexOf("test_testTreeBook_delete") !== -1;

      dictCodes({codes:'sys_flag,'}).then(response => {
      this.delFlagOptions = response.data[0];
      });
    },
    computed: {
      ...mapGetters([
        'authorities'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.isAsc = false;
        this.listQuery.queryConditionJson = parseJsonItemForm([
        {fieldName: 'parentId',value:this.listQuery.parentId,operate:'eq',attrType:'String'},
        {fieldName: 'name',value:this.listQuery.name,operate:'like',attrType:'String'},
        {fieldName: 'parentId',value:this.listQuery.parentId, attrType:'eq'},
        ])
        pageTestTreeBook(this.listQuery).then(response => {
          this.list = response.data;
          this.total = response.total;
          this.listLoading = false;
        });
      },
      getTree() {
        fetchTestTreeBookTree({all:true}).then(response => {
          this.treeData = parseTreeData(response.data);
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      getNodeData(data) {
        this.listQuery.parentId = data.id
        this.currentNode = data;
        this.getList()
      },
      getNodeFormData(data){
        this.dialogTestTreeBookVisible = false;
        this.form.parentId = data.id;
        this.form.parentName = data.label;
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
        this.dialogStatus = row && validateNotNull(row.id)? "update" : "create";
        if(this.dialogStatus == "create"){
          this.dialogFormVisible = true;
          this.form.parentId = this.currentNode.id
          this.form.parentName = this.currentNode.label;
        }else{
          findTestTreeBook(row.id).then(response => {
            this.form = response.data;
            this.form.status=objectToString(this.form.status)
            this.dialogFormVisible = true;
          });
        }
      },
      handleLock: function (row) {
        lockTestTreeBook(row.id).then((data) => {
          if (data.status == MSG_TYPE_SUCCESS) {
            this.getList();
          }
        });
      },
      handleTestTreeBook() {
        fetchTestTreeBookTree({extId: this.form.id}).then(response => {
          this.treeTestTreeBookData = parseTreeData(response.data);
          this.dialogTestTreeBookVisible = true;
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeTestTreeBook(row.id).then(() => {
            if (data.status == MSG_TYPE_SUCCESS) {
              this.getList();
            }
          })
        })
      },
      save() {
        const set = this.$refs;
        set['form'].validate(valid => {
          if (valid) {
            saveTestTreeBook(this.form).then(() => {
              this.getList()
              this.dialogFormVisible = false;
            })
          } else {
            return false;
          }
        });
      },
      cancel() {
        this.dialogFormVisible = false;
        this.$refs['form'].resetFields();
      },
      resetForm() {
        this.form = {
        name: "",
        sort: "",
        description: "",
        }
        if(this.$refs['form']){
          this.$refs['form'].resetFields();
        }
      }
    }
  }
</script>