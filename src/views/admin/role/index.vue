

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
          <div class="filter-container" v-show="searchFilterVisible">
            <el-form :inline="true" ref="searchForm">
              <el-form-item label="名称">
                <el-input class="filter-item input-normal" size="small" v-model="listQuery.name"></el-input>
              </el-form-item>
              <el-form-item label="编码">
                <el-input class="filter-item input-normal" size="small" v-model="listQuery.code"></el-input>
              </el-form-item>
              <el-form-item label="数据范围">
                <CrudSelect  class="filter-item input-normal" size="small" v-model="listQuery.dataScope" :multiple="true" :filterable="true" :dic="rolesOptions"></CrudSelect>
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
              <el-button size="small" v-if="sys_role_edit" class="filter-item" @click="handleEdit" type="primary" icon="edit">添加</el-button>
            </div>
            <div class="table-menu-right">
              <el-button icon="el-icon-search" circle size="small" @click="searchFilterVisible= !searchFilterVisible"></el-button>
            </div>
          </div>
          <el-table  shadow="hover" :key='tableKey' @sort-change="sortChange" :data="list" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
            <el-table-column
              type="index" fixed="left" width="60">
            </el-table-column>
            <el-table-column align="center" label="所属组织" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.deptName}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="角色名" width="100" prop="rolename" sortable="custom">
              <template slot-scope="scope">
          <span>
<!--            <img v-if="scope.row.avatar" class="role-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="getFilePath(scope.row.avatar)">-->
            {{scope.row.rolename}}
          </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="手机号" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.phone}}</span>
              </template>
            </el-table-column>


            <el-table-column align="center" label="锁定" width="80">
              <template slot-scope="scope">
                <el-tag>{{scope.row.lockFlagText}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="120" prop="createdDate" sortable="custom">
              <template slot-scope="scope">
                <span>{{scope.row.createdDate}}</span>
              </template>
            </el-table-column>


            <el-table-column align="center" fixed="right" width="130" label="操作" v-if="sys_role_edit || sys_role_lock || sys_role_delete">
              <template slot-scope="scope">
                <el-button v-if="sys_role_edit" icon="icon-edit" title="编辑" type="text" @click="handleEdit(scope.row)">
                </el-button>
                <el-button v-if="sys_role_lock" :icon="scope.row.lockFlag == '0' ? 'icon-lock' : 'icon-unlock'" :title="scope.row.lockFlag == '0' ? '锁定' : '解锁'" type="text" @click="handleLock(scope.row)">
                </el-button>
                <el-button v-if="sys_role_delete" icon="icon-delete" title="删除" type="text" @click="handleDelete(scope.row)">
                </el-button>
              </template>
            </el-table-column>

          </el-table>
          <div v-show="!listLoading" class="pagination-container">
            <el-pagination class="pull-right" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="form" label-width="100px">

          <el-form-item label="角色名" prop="name" :rules="[
          {required: true,message: '请输入角色名'},
          {min: 3,max: 20,message: '长度在 3 到 20 个字符'}
        ]">
            <el-input v-model="form.name" placeholder="请输角色名"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password" :rules="[{validator: validatePass}]">
            <el-input type="password" v-model="form.password" :placeholder="this.dialogStatus == 'create' ? '请输入密码' : '若不修改密码，请留空'" ></el-input>
          </el-form-item>

          <el-form-item label="确认密码" placeholder="请再次输入密码" prop="confirmPassword" :rules="[{validator: validateConfirmPass}]">
            <el-input type="password" v-model="form.confirmPassword"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="phone" :rules="[{validator:validatePhone}]">
            <el-input v-model="form.phone" placeholder="验证码登录使用"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :rules="[{ type: 'email',message: '请填写正确邮箱' }]">
            <el-input v-model="form.email"></el-input>
          </el-form-item>

          <el-form-item label="角色" prop="roleIdList" :rules="[{required: true,message: '请选择角色' }]">
            <CrudSelect v-model="form.roleIdList" :multiple="true" :filterable="true" :dic="rolesOptions"></CrudSelect>
          </el-form-item>

          <el-form-item label="锁定" prop="lockFlag" :rules="[{required: true,message: '请选择' }]">
            <CrudRadio v-model="form.lockFlag" :dic="flagOptions"></CrudRadio>
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
  import {findRole, saveRole, removeRole, pageRole, lockRole} from "./service";
  import {fetchDeptTree} from "../dept/service";
  import {deptRoleList} from "./service";
  import { mapGetters } from 'vuex';
  import {parseJsonItemForm, parseTreeData} from "@/util/util";
  import {
    isValidateMobile,
    isValidateUnique,
    objectToString, toStr,
    validateNull,
    validateNotNull
  } from "@/util/validate";
  import {MSG_TYPE_SUCCESS} from "@/const/common";
  import CrudSelect from "@/views/avue/crud-select";
  import CrudRadio from "@/views/avue/crud-radio";
  import {SYS_NO, SYS_YES} from "../../../const/common";
  export default {
    name: 'Role',
    components: {CrudSelect,CrudRadio},
    data() {
      return {
        dialogDeptVisible: false,
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
        filterText: '',
        filterFormText: '',
        formStatus: '',
        flagOptions: [],
        dataScopeOptions: [],
        searchTree: false,
        labelPosition: 'right',
        form: {
          name: undefined,
          deptId: undefined,
          password: undefined,
          confirmPassword: undefined,
          phone: undefined,
          email: undefined,
          roleIdList: undefined,
          lockFlag: undefined,
          description: undefined
        },
        validateUnique: (rule, value, callback) => {
          isValidateUnique(rule, value, callback, '/admin/sys/role/checkByProperty?id='+toStr(this.form.id))
        },
        dialogStatus: 'create',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        sys_role_edit: false,
        sys_role_lock: false,
        sys_role_delete: false,
        currentNode: {},
        tableKey: 0
      }
    },
    watch: {
      filterText(val) {
        this.$refs['leftDeptTree'].filter(val);
      }
    },
    created() {
      this.getTreeDept()
      this.getList()
      this.sys_role_edit = this.permissions["sys_role_edit"];
      this.sys_role_lock = this.permissions["sys_role_lock"];
      this.sys_role_delete = this.permissions["sys_role_del"];
      this.flagOptions = this.dicts['sys_flag'];
      this.dataScopeOptions = this.dicts['sys_data_scope'];
    },
    computed: {
      ...mapGetters([
        "permissions","dicts"
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        // this.listQuery.isAsc = false;
        this.listQuery.queryConditionJson = parseJsonItemForm([{
          fieldName: 'a.name',value:this.listQuery.name
        },{
          fieldName: 'a.code',value:this.listQuery.code
        },{
          fieldName: 'a.data_scope',value:this.listQuery.dataScope, operate:"in"
        }])
        pageRole(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        });
      },
      sortChange(column){
        if(column.order=="ascending"){
          this.listQuery.asc=column.prop
          this.listQuery.desc=undefined;
        }else{
          this.listQuery.desc=column.prop
          this.listQuery.asc=undefined;
        }
        this.getList()
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      clickNodeSelectData(data) {
        console.log(data)
        this.form.deptId = data.id;
        this.form.deptName = data.label;
        this.dialogDeptVisible = false;
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
          findRole(row.id).then(response => {
            this.form = response.data;
            console.log(this.form)
            this.form.password=undefined;
            this.dialogFormVisible = true;
          });
        }
      },
      handleLock: function (row) {
        lockRole(row.id).then((data) => {
          this.getList();
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRole(row.id).then((rs) => {
            this.getList();
          })
        })
      },
      save() {
        console.log(this.$refs['form'])
        this.$refs['form'].validate(valid => {
          console.log(valid)
          if (valid) {
            saveRole(this.form).then(() => {
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
          deptId: undefined,
          deptName: undefined,
          password: undefined,
          confirmPassword: undefined,
          phone: undefined,
          email: undefined,
          roleIdList: undefined,
          lockFlag: undefined,
          description: undefined
        }
        this.$refs['form']&&this.$refs['form'].resetFields();
      }
    }
  }
</script>

