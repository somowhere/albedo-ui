

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-row>

        <el-col>
          <div class="filter-container" v-show="searchFilterVisible">
            <el-form :inline="true" :model="listQuery" ref="searchForm">
              <el-form-item label="名称">
                <el-input class="filter-item input-normal" size="small" v-model="listQuery.username"></el-input>
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
              <el-button size="small" v-if="sys_client_edit" class="filter-item" @click="handleEdit" type="primary" icon="edit">添加</el-button>
            </div>
            <div class="table-menu-right">
              <el-button icon="el-icon-search" circle size="small" @click="searchFilterVisible= !searchFilterVisible"></el-button>
            </div>
          </div>
          <el-table  shadow="hover" :key='tableKey' @sort-change="sortChange" :data="list" v-loading="listLoading" element-loading-text="加载中..." fit highlight-current-row>
            <el-table-column
              type="index" fixed="left" width="50">
            </el-table-column>
            <el-table-column align="center" label="数据权限" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.dataScopeText}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="终端名称" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="终端标识" width="140">
              <template slot-scope="scope">
          <span>
            {{scope.row.code}}
          </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="终端描述" width="120">
              <template slot-scope="scope">
          <span>
            {{scope.row.remark}}
          </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="锁定" width="80">
              <template slot-scope="scope">
                <el-tag>{{scope.row.lockFlagText}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="160" prop="a.created_date" sortable="custom">
              <template slot-scope="scope">
                <span>{{scope.row.createdDate}}</span>
              </template>
            </el-table-column>


            <el-table-column align="center" label="操作" fixed="right" width="130" v-if="sys_client_edit || sys_client_delete">
              <template slot-scope="scope">
                <el-button v-if="sys_client_edit" icon="icon-edit" title="编辑" type="text" @click="handleEdit(scope.row)">
                </el-button>
                <el-button v-if="sys_client_delete" icon="icon-delete" title="删除" type="text" @click="handleDelete(scope.row)">
                </el-button>
              </template>
            </el-table-column>

          </el-table>
          <div v-show="!listLoading" class="pagination-container">
            <el-pagination class="pull-right" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="form" label-width="100px">
          <el-form-item label="数据权限" prop="dataScope" :rules="[{required: true,message: '请选择' }]">
            <CrudRadio v-model="form.dataScope" :dic="dataScopeOptions"></CrudRadio>
          </el-form-item>
          <el-form-item label="终端名称" prop="name" :rules="[
          {required: true,message: '请输入终端名称'},
          {validator:validateUnique}
        ]">
            <el-input v-model="form.name" placeholder="请输入终端名称"></el-input>
          </el-form-item>
          <el-form-item label="终端标识" prop="code" :rules="[{required: true,message: '请输入终端名称'}]">
            <el-input v-model="form.code" placeholder="请输入终端标识"></el-input>
          </el-form-item>
          <el-col :span="12">
            <el-form-item label="操作权限" prop="menuIdList">
              <el-tree class="filter-tree" :data="treeMenuData" ref="treeMenu" node-key="id"
                       show-checkbox default-expand-all :default-checked-keys="form.menuIdList" @check="getNodeTreeMenuData">
              </el-tree>
            </el-form-item>
          </el-col>
          <el-form-item label="锁定" prop="lockFlag" :rules="[{required: true,message: '请选择' }]">
            <CrudRadio v-model="form.lockFlag" :dic="flagOptions"></CrudRadio>
          </el-form-item>
          <el-form-item label="终端描述" prop="remark" :rules="[{required: true, message: '请输入终端描述'}]">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input type="textarea" v-model="form.description" placeholder=""></el-input>
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
  import {findClient, saveClient, removeClient, pageClient} from "./service";
  import {fetchMenuTree} from "../menu/service";
  import {mapGetters } from 'vuex';
  import {parseJsonItemForm,parseTreeData} from "@/util/util";
  import {isValidateUnique,toStr,validateNotNull} from "@/util/validate";
  import CrudSelect from "@/views/avue/crud-select";
  import CrudRadio from "@/views/avue/crud-radio";
  import {MSG_TYPE_SUCCESS} from "../../../const/common";
  export default {
    name: 'Client',
    components: {CrudSelect,CrudRadio},
    data() {
      return {
        treeMenuData:[],
        dialogFormVisible: false,
        searchFilterVisible: true,
        checkedKeys: [],
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          current: 1,
          size: 20
        },
        formEdit: true,
        flagOptions: [],
        dataScopeOptions:[],
        form: {
          name: undefined,
          dataScope: undefined,
          code: undefined,
          menuIdList: [],
          remark: undefined,
          lockFlag: undefined,
          description: undefined
        },
        validateUnique: (rule, value, callback) => {
          isValidateUnique(rule, value, callback, '/admin/client/checkByProperty?id='+toStr(this.form.id))
        },
        dialogStatus: 'create',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        sys_client_edit: false,
        sys_client_delete: false,
        currentNode: {},
        tableKey: 0
      }
    },
    watch: {
    },
    created() {
      this.getList()
      this.sys_client_edit = this.permissions["sys_client_edit"];
      this.sys_client_delete = this.permissions["sys_client_del"];
      this.flagOptions = this.dicts['sys_flag'];
      this.dataScopeOptions = this.dicts['sys_data_scope'];
      fetchMenuTree().then(rs => {
        this.treeMenuData = parseTreeData(rs.data);
      })
    },
    computed: {
      ...mapGetters([
        "permissions","dicts"
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.queryConditionJson = parseJsonItemForm([{
          fieldName: 'name',value:this.listQuery.name}])
        pageClient(this.listQuery).then(response => {
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

      //搜索清空
      searchReset() {
        this.$refs['searchForm'].resetFields();
      },
      handleFilter() {
        this.listQuery.current = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.size = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.current = val;
        this.getList();
      },
      handleEdit(row) {
        this.resetForm();
        this.dialogStatus = row && validateNotNull(row.id)? "update" : "create";
        if(this.dialogStatus == "create"){
          this.dialogFormVisible = true;
        }else{
          findClient(row.id).then(response => {
              this.form = response.data;
              this.dialogFormVisible = true;
              if (this.$refs.treeMenu) {
                // console.log(this.$refs.treeMenu);
                // console.log(this.form.menuIdList);
                // this.$refs.treeMenu.setCheckedKeys(this.form.menuIdList);
              }
          });
        }
      },
      handleLock: function (row) {
        lockClient(row.id).then(response =>{
          this.getList();
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeClient(row.id).then(response => {
              this.getList();
          })
        })
      },
      getNodeTreeMenuData(data, obj) {
        this.form.menuIdList = obj.checkedKeys;
      },
      save() {
        console.log(this.$refs['form'])
        this.$refs['form'].validate(valid => {
          console.log(valid)
          if (valid) {
            saveClient(this.form).then(response => {
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
          name: undefined,
          dataScope: undefined,
          code: undefined,
          menuIdList: [],
          remark: undefined,
          lockFlag: undefined,
          description: undefined
        }
        this.$refs['form']&&this.$refs['form'].resetFields();
      }
    }
  }
</script>

