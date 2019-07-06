
<template>
  <div class="app-container calendar-list-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>部门</span>
            <el-button type="text" class="card-heard-btn" icon="icon-filesearch" title="搜索" @click="searchTree=(searchTree ? false:true)"></el-button>
            <el-button type="text" class="card-heard-btn" icon="icon-reload" title="刷新" @click="getTree()"></el-button>
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
            @node-click="clickNodeTreeData">
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="19">
        <div class="filter-container">
          <el-form :inline="true">
            <el-form-item label="名称">
              <el-input class="filter-item input-normal" v-model="listQuery.username"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
              <el-button v-if="sys_user_edit" class="filter-item" style="margin-left: 10px;" @click="handleEdit" type="primary" icon="edit">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row style="width: 99%">

          <el-table-column align="center" label="所属组织">
            <template slot-scope="scope">
              <span>{{scope.row.orgName}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="用户名">
            <template slot-scope="scope">
          <span>
<!--            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="getFilePath(scope.row.avatar)">-->
            {{scope.row.username}}
          </span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="邮件">
            <template slot-scope="scope">
          <span>
            {{scope.row.email}}
          </span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="手机号">
            <template slot-scope="scope">
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="角色">
            <template slot-scope="scope">
              <span v-for="role in scope.row.roles">{{role.name}} </span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.createdDate}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" class-name="status-col" label="状态">
            <template slot-scope="scope">
              <el-tag>{{scope.row.statusText}}</el-tag>
            </template>
          </el-table-column>

          <el-table-column align="center" fixed="right" label="操作" v-if="sys_user_edit || sys_user_lock || sys_user_delete">
            <template slot-scope="scope">
              <el-button v-if="sys_user_edit" icon="icon-edit" title="编辑" type="text" @click="handleEdit(scope.row)">
              </el-button>
              <el-button v-if="sys_user_lock" :icon="scope.row.status=='正常' ? 'icon-lock' : 'icon-unlock'" :title="scope.row.status=='正常' ? '锁定' : '解锁'" type="text" @click="handleLock(scope.row)">
              </el-button>
              <el-button v-if="sys_user_delete" icon="icon-delete" title="删除" type="text" @click="handleDelete(scope.row)">
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
    <el-dialog title="选择部门" :visible.sync="dialogOrgVisible">
      <el-tree class="filter-tree" :data="treeDeptData" :default-checked-keys="checkedKeys"
               check-strictly node-key="id" highlight-current
               :props="defaultProps" @node-click="clickNodeSelectData" default-expand-all>
      </el-tree>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :model="form" ref="form" label-width="100px">
<!--      <el-form-item label="头像" prop="avatar">-->
<!--        <my-upload field="uploadFile" @crop-upload-success="cropUploadSuccess" v-model="showUpload"-->
<!--                   :width="300" :height="300" :url="ctx+'/file/upload'" :headers="headers" img-format="png"></my-upload>-->
<!--        <img :src="getFilePath(form.avatar)" class="header-img" />-->
<!--        <input type="hidden" v-model="form.avatar" />-->
<!--        <el-button type="primary" @click="showUpload = !showUpload" size="mini">选择-->
<!--          <i class="el-icon-upload el-icon&#45;&#45;right"></i>-->
<!--        </el-button>-->
<!--      </el-form-item>-->
      <el-form-item label="所属部门" prop="deptName" :rules="[{required: true,message: '请选择部门'}]">
        <el-input v-model="form.deptName" placeholder="选择部门" @focus="handleDept()" readonly></el-input>
        <input type="hidden" v-model="form.deptId" />
      </el-form-item>

      <el-form-item label="用户名" prop="loginId" :rules="[
          {required: true,message: '请输入账户'},
          {min: 3,max: 20,message: '长度在 3 到 20 个字符'},
          {validator:validateUnique}
        ]">
        <el-input v-model="form.loginId" placeholder="请输用户名"></el-input>
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
        <AvueCrudSelect v-model="form.roleIdList" :multiple="true" :filterable="true" :dic="rolesOptions"></AvueCrudSelect>
      </el-form-item>

      <el-form-item label="状态" prop="status" :rules="[{required: true,message: '请选择状态' }]">
        <AvueCrudRadio v-model="form.status" :dic="statusOptions"></AvueCrudRadio>
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
  </div>
</template>

<script>
  import {findUser, saveUser, removeUser, pageUser, lockUser} from "./userService";
  import {fetchDeptTree} from "../dept/deptService";
  import {deptRoleList} from "../role/roleService";
  import { mapGetters } from 'vuex';
  import {parseJsonItemForm, parseTreeData} from "@/util/util";
  import {
    isValidateMobile,
    isValidateUnique,
    objectToString, toStr,
    validateNull
  } from "@/util/validate";
  import {MSG_TYPE_SUCCESS} from "@/const/common";
  export default {
    name: 'User',
    data() {
      return {
        treeDeptData: [],
        dialogDeptVisible: false,
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
        rolesOptions: [],
        searchTree: false,
        treeData: [],
        labelPosition: 'right',
        form: {
          username: undefined,
          deptId: undefined,
          phone: undefined,
          email: undefined,
          roleIdList: undefined,
          status: undefined,
          description: undefined
        },
        validateUnique: (rule, value, callback) => {
          isValidateUnique(rule, value, callback, '/admin/sys/user/checkByProperty?id='+toStr(this.form.id))
        },
        validatePhone: (rule, value, callback) => {
          isValidateMobile(rule, value, callback)
        },
        dialogStatus: 'create',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        sys_user_edit: false,
        sys_user_lock: false,
        sys_user_delete: false,
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
      this.sys_user_edit = this.permissions.indexOf("sys_user_edit") !== -1;
      this.sys_user_lock = this.permissions.indexOf("sys_user_lock") !== -1;
      this.sys_user_delete = this.permissions.indexOf("sys_user_delete") !== -1;
      deptRoleList().then(response => {
        this.rolesOptions = response.data;
      });
      this.statusOptions = this.dicts['sys_status'];
    },
    computed: {
      ...mapGetters([
        "permissions","dicts"
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.isAsc = false;
        this.listQuery.queryConditionJson = parseJsonItemForm([{
          fieldName: 'a.username',value:this.listQuery.username
        },{
          fieldName: 'parentId',value:this.listQuery.parentId
        }])
        pageUser(this.listQuery).then(response => {
          this.list = response.data;
          this.total = response.total;
          this.listLoading = false;
        });
      },
      getTree() {
        fetchDeptTree({all:true}).then(response => {
          this.treeData = parseTreeData(response.data);
          console.log(this.treeData)
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      clickNodeTreeData(data) {
        this.listQuery.deptId = data.id
        this.currentNode = data;
        this.getList()
      },

      clickNodeSelectData(data) {
        this.dialogOrgVisible = false;
        this.form.orgId = data.id;
        this.form.orgName = data.label;
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
          findUser(row.id).then(response => {
            this.form = response.data;
            this.form.password="";
            this.form.status=objectToString(this.form.status)
            this.dialogFormVisible = true;
          });
        }
      },
      handleLock: function (row) {
        lockUser(row.id).then((data) => {
          if (data.status == MSG_TYPE_SUCCESS) {
            this.getList();
          }
        });
      },
      handleUser() {
        fetchUserTree({extId: this.form.id}).then(response => {
          this.treeDeptData = parseTreeData(response.data);
          this.dialogDeptVisible = true;
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeUser(row.id).then((rs) => {
            if (rs.status == MSG_TYPE_SUCCESS) {
              this.getList();
            }
          })
        })
      },
      save() {
        const set = this.$refs;
        set['form'].validate(valid => {
          if (valid) {
            saveUser(this.form).then(() => {
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
          permission: undefined,
          name: undefined,
          menuId: undefined,
          parentId: undefined,
          url: undefined,
          icon: undefined,
          sort: undefined,
          component: undefined,
          type: undefined,
          method: undefined
        }
        if(this.$refs['form']){
          this.$refs['form'].resetFields();
        }
      }
    }
  }
</script>

