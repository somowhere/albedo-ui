

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-row :gutter="20">
        <el-col :span="6"
                style='margin-top:15px;'>
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>菜单</span>
              <el-button type="text" class="card-heard-btn" icon="icon-filesearch" title="搜索" @click="searchTree=(searchTree ? false:true)"></el-button>
              <el-button type="text" class="card-heard-btn" icon="icon-reload" title="刷新" @click="getTreeMenu()"></el-button>
            </div>
            <el-input v-show="searchTree"
                      placeholder="输入关键字进行过滤"
                      v-model="filterText">
            </el-input>
            <el-tree
              class="filter-tree"
              :data="treeMenuData"
              ref="leftMenuTree"
              node-key="id"
              highlight-current default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              @node-click="clickNodeTreeData">
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="18">
          <div class="filter-container" v-show="searchFilterVisible">
            <el-form :inline="true" ref="searchForm">
              <el-form-item label="名称">
                <el-input class="filter-item input-normal" size="small" v-model="listQuery.name"></el-input>
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
              <el-button size="small" v-if="sys_menu_edit" class="filter-item" @click="handleEdit" type="primary" icon="edit">添加</el-button>
            </div>
            <div class="table-menu-right">
              <el-button icon="el-icon-search" circle size="small" @click="searchFilterVisible= !searchFilterVisible"></el-button>
            </div>
          </div>
          <el-table  shadow="hover" :key='tableKey' @sort-change="sortChange" :data="list" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
            <el-table-column
              type="index" fixed="left" width="60">
            </el-table-column>
            <el-table-column align="center" label="上级菜单" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.parentName}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="名称" width="100" prop="menu.name" sortable="custom">
              <template slot-scope="scope">
                <span>
                  {{scope.row.name}}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="权限" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.permission}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="图标" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.icon}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="VUE页面" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.component}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="菜单类型" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.typeText}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="路由缓冲" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.keepAliveText}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="前端URL" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.path}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="显示" width="80">
              <template slot-scope="scope">
                <el-tag>{{scope.row.showText}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="序号" width="100" prop="menu.sort" sortable="custom">
              <template slot-scope="scope">
                <span>
                  {{scope.row.sort}}
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" prop="menu.created_date" sortable="custom">
              <template slot-scope="scope">
                <span>{{scope.row.createdDate}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" fixed="right" width="100" label="操作" v-if="sys_menu_edit || sys_menu_lock || sys_menu_delete">
              <template slot-scope="scope">
                <el-button v-if="sys_menu_edit" icon="icon-edit" title="编辑" type="text" @click="handleEdit(scope.row)">
                </el-button>
                <el-button v-if="sys_menu_delete" icon="icon-delete" title="删除" type="text" @click="handleDelete(scope.row)">
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
      <el-dialog title="选择菜单" :visible.sync="dialogMenuVisible">
        <el-tree class="filter-tree" ref="selectParentMenuTree" default-expand-all :data="treeMenuData" :default-checked-keys="checkedKeys"
                 check-strictly node-key="id" highlight-current @node-click="clickNodeSelectData">
        </el-tree>
      </el-dialog>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="form" label-width="100px">
          <el-form-item label="所属菜单" prop="parentName">
            <el-input v-model="form.parentName" placeholder="选择菜单" @focus="selectParentMenuTree()" :disabled="disableSelectParent" readonly>
            </el-input>
            <input type="hidden" v-model="form.parentId" />
          </el-form-item>

          <el-form-item label="名称" prop="name" :rules="[{required: true,message: '请输入菜单名称'}]">
            <el-input v-model="form.name" placeholder="请输入名称"></el-input>
          </el-form-item>

          <el-form-item label="权限" prop="permission" :rules="[ {validator:validateUnique}]">
            <el-input v-model="form.permission" placeholder="请输入权限"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="form.icon"></el-input>
          </el-form-item>
          <el-form-item label="VUE页面" prop="component">
            <el-input v-model="form.component"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" prop="type" :rules="[{required: true,message: '请选择' }]">
            <CrudRadio v-model="form.type" :dic="menuTypeOptions"></CrudRadio>
          </el-form-item>
          <el-form-item label="路由缓冲" prop="keepAlive" >
            <el-switch
              v-model="form.keepAlive"
              active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="前端URL" prop="path" >
            <el-input v-model="form.path"></el-input>
          </el-form-item>
          <el-form-item label="是否显示" prop="show" :rules="[{required: true,message: '请选择' }]">
            <CrudRadio v-model="form.show" :dic="flagOptions"></CrudRadio>
          </el-form-item>
          <el-form-item label="序号" prop="sort">
            <el-input-number v-model="form.sort" :min="1" :max="1000"></el-input-number>
          </el-form-item>
          <el-form-item label="描述" prop="description">
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
  import {findMenu, lockMenu, pageMenu, removeMenu, saveMenu, fetchMenuTree} from "./service";
  import {mapGetters} from 'vuex';
  import {parseJsonItemForm, parseTreeData} from "@/util/util";
  import {isValidateUnique, toStr, validateNotNull} from "@/util/validate";
  import CrudSelect from "@/views/avue/crud-select";
  import CrudRadio from "@/views/avue/crud-radio";
  import {objectToString} from "../../../util/validate";

  export default {
    name: 'Menu',
    components: {CrudSelect,CrudRadio},
    data() {
      return {
        treeMenuData: [],
        dialogMenuVisible: false,
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
        menuTypeOptions: [],
        searchTree: false,
        labelPosition: 'right',
        disableSelectParent: false,
        form: {
          name: undefined,
          parentId: undefined,
          permission: undefined,
          icon: undefined,
          component: undefined,
          type: undefined,
          keepAlive: undefined,
          show:undefined,
          path:undefined,
          sort:undefined,
          description: undefined
        },
        validateUnique: (rule, value, callback) => {
          isValidateUnique(rule, value, callback, '/admin/sys/menu/checkByProperty?id='+toStr(this.form.id))
        },
        dialogStatus: 'create',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        sys_menu_edit: false,
        sys_menu_lock: false,
        sys_menu_delete: false,
        currentNode: {},
        tableKey: 0
      }
    },
    watch: {
      filterText(val) {
        this.$refs['leftMenuTree'].filter(val);
      }
    },
    created() {
      this.getTreeMenu()
      this.sys_menu_edit = this.permissions["sys_menu_edit"];
      this.sys_menu_lock = this.permissions["sys_menu_lock"];
      this.sys_menu_delete = this.permissions["sys_menu_del"];
      console.log(this.dicts)
      this.flagOptions = this.dicts['sys_flag'];
      this.menuTypeOptions = this.dicts['sys_menu_type'];

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
          fieldName: 'name',value:this.listQuery.name
        },{
          fieldName: 'parent_id',value:this.listQuery.parentId,operate:'eq'
        }])
        pageMenu(this.listQuery).then(response => {
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
      getTreeMenu() {
        fetchMenuTree({extId:this.form.id}).then(response => {
          this.treeMenuData = parseTreeData(response.data);
          this.currentNode = this.treeMenuData[0];
          this.listQuery.parentId=this.treeMenuData[0].id;
          setTimeout(() => {
            this.$refs['leftMenuTree'].setCurrentKey(this.listQuery.parentId);
          }, 100)
          this.getList();
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      clickNodeTreeData(data) {
        this.listQuery.parentId = data.id
        this.currentNode = data;
        this.getList()
      },
      clickNodeSelectData(data) {
        console.log(data)
        this.form.parentId = data.id;
        this.form.parentName = data.label;
        this.dialogMenuVisible = false;
      },
      selectParentMenuTree(){
        this.dialogMenuVisible=true;
        setTimeout(()=>{this.$refs['selectParentMenuTree'].setCurrentKey(this.form.parentId ? this.form.parentId : null);}, 100)
      },
      //搜索清空
      searchReset() {
        this.$refs['searchForm'].resetFields();
        this.listQuery.parentId = undefined;
        this.$refs['leftMenuTree'].setCurrentKey(null);
        this.currentNode=undefined;
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
          if(this.currentNode){
            this.form.parentId=this.currentNode.id;
            this.form.parentName=this.currentNode.label;
          }
          this.dialogFormVisible = true;
        }else{
          findMenu(row.id).then(response => {
            this.form = response.data;
            this.disableSelectParent = this.form.parentName ? false : true;
            this.form.show=objectToString(this.form.show);
            this.dialogFormVisible = true;
          });
        }
      },
      handleLock: function (row) {
        lockMenu(row.id).then((data) => {
          this.getList();
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeMenu(row.id).then((rs) => {
            this.getList();
          })
        })
      },
      save() {
        console.log(this.$refs['form'])
        this.$refs['form'].validate(valid => {
          console.log(valid)
          if (valid) {
            saveMenu(this.form).then(() => {
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
          parentId: undefined,
          permission: undefined,
          icon: undefined,
          component: undefined,
          type: undefined,
          keepAlive: undefined,
          show:undefined,
          path:undefined,
          sort:undefined,
          description: undefined
        }
        this.$refs['form']&&this.$refs['form'].resetFields();
      }
    }
  }
</script>

