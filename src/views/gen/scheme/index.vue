
<template>
  <div class="app-container calendar-list-container">
    <basic-container>
    <div class="filter-container" v-show="searchFilterVisible">
      <el-form ref="searchForm"  :model="listQuery" :inline="true">
        <el-form-item label="名称" prop="name">
          <el-input size="small" class="filter-item input-normal" v-model="listQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="表名" ref="tableName">
          <el-input size="small" class="filter-item input-normal" v-model="listQuery.tableName"></el-input>
        </el-form-item>
        <el-form-item label="功能名称" prop="functionName">
          <el-input size="small" class="filter-item input-normal" v-model="listQuery.functionName"></el-input>
        </el-form-item>
        <el-form-item label="功能作者" prop="functionAuthor">
          <el-input size="small" class="filter-item input-normal" v-model="listQuery.functionAuthor"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button size="small" @click="searchReset" icon="el-icon-delete" >清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格功能列 -->
    <div class="table-menu">
      <div class="table-menu-left"><el-button size="small" v-if="gen_scheme_edit" class="filter-item" style="margin-left: 10px;" @click="handleEdit" type="primary" icon="edit">添加</el-button>
      </div>
      <div class="table-menu-right">
        <el-button icon="el-icon-search" circle size="small" @click="searchFilterVisible= !searchFilterVisible"></el-button>
      </div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中..." fit highlight-current-row>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="表名">
        <template slot-scope="scope">
          <span>{{scope.row.genTableName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="基础包名">
        <template slot-scope="scope">
          <span>
            {{scope.row.packageName}}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="模块">
        <template slot-scope="scope">
          <span>{{scope.row.moduleName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="功能名称">
        <template slot-scope="scope">
          <span>{{scope.row.functionName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="功能作者">
        <template slot-scope="scope">
          <span>{{scope.row.functionAuthor}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="gen_scheme_edit" icon="icon-edit" title="编辑" type="text" @click="handleEdit(scope.row)">
          </el-button>
          <el-button v-if="gen_table_del" icon="icon-delete" title="删除" type="text" @click="handleDelete(scope.row)">
          </el-button>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus" @click="handleGenCode(scope.row, false)">生成代码</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus" @click="handleGenCode(scope.row, true)">生成代码并覆盖</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="120px">
        <el-form-item label="方案名称"
                      inline-message="生成结构：(包名)/(模块名)/(分层(dao,entity,service,web))/(子模块名)/(java类)"
                      prop="name" :rules="[{required: true,message: '请输入方案名称'}]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="模块分类" prop="category"
                      :rules="[{required: true,message: '请选择模块分类'}]">
          <CrudSelect v-model="form.category" :dic="categoryList" ></CrudSelect>
        </el-form-item>
        <el-form-item label="生成包路径" prop="packageName"
                      :rules="[{required: true,message: '请输入生成包路径'}]">
          <el-input v-model="form.packageName"></el-input>
        </el-form-item>
        <el-form-item label="生成模块名" prop="moduleName"
                      :rules="[{required: true,message: '请输入生成模块名'}]">
          <el-input v-model="form.moduleName"></el-input>
        </el-form-item>
        <el-form-item label="生成子模块名" prop="subModuleName">
          <el-input v-model="form.subModuleName"></el-input>
        </el-form-item>
        <el-form-item label="生成功能描述" prop="functionName"
                      :rules="[{required: true,message: '请输入生成功能描述'}]">
          <el-input v-model="form.functionName"></el-input>
        </el-form-item>
        <el-form-item label="生成功能名" prop="functionNameSimple"
                      :rules="[{required: true,message: '请输入生成功能名'}]">
          <el-input v-model="form.functionNameSimple"></el-input>
        </el-form-item>
        <el-form-item label="生成功能作者" prop="functionAuthor"
                      :rules="[{required: true,message: '请输入生成功能作者'}]">
          <el-input v-model="form.functionAuthor"></el-input>
        </el-form-item>
        <el-form-item label="业务表名" prop="genTableId"
                      :rules="[{required: true,message: '请选择业务表名'}]">
          <CrudSelect v-model="form.genTableId" :dic="tableList" ></CrudSelect>
        </el-form-item>
        <el-form-item label="生成选项">
          <el-switch v-model="form.genCode" active-text="是否生成代码">
          </el-switch>
          <el-switch v-model="form.replaceFile" active-text="是否替换现有文件">
          </el-switch>
        </el-form-item>
        <el-form-item label="同步模块" prop="syncModule">
          <el-switch v-model="form.syncModule" @change="showModuleVisible = form.syncModule" active-text="是否同步模块数据">
          </el-switch>
        </el-form-item>
        <el-form-item label="功能模块" prop="parentModuleId" v-show="showModuleVisible">
          <el-input v-model="form.parentModuleName" placeholder="选择模块" @focus="handleModule()" readonly></el-input>
          <input type="hidden" v-model="form.parentModuleId" />
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

    <el-dialog title="选择模块" :visible.sync="dialogModuleVisible">
      <el-input placeholder="输入关键字进行过滤"
                v-model="filterFormText">
      </el-input>
      <el-tree class="filter-tree" ref="formTree" :data="treeModuleData"
               check-strictly node-key="id" highlight-current @node-click="getNodeData"
               :filter-node-method="filterNode" default-expand-all>
      </el-tree>
    </el-dialog>
    </basic-container>
  </div>
</template>

<script>
  import {findGenScheme, genCode, pageGenScheme, removeGenScheme, saveGenScheme} from "./service";
  import {mapGetters} from "vuex";
  import { validateNull, validateNotNull} from "@/util/validate";
  import {parseJsonItemForm, parseTreeData} from "@/util/util";
  import {fetchMenuTree} from "../../admin/menu/service";
  import CrudSelect from "@/views/avue/crud-select";
  import CrudRadio from "@/views/avue/crud-radio";

  export default {
    components: {CrudSelect,CrudRadio},
  name: "Scheme",
  data() {
    return{
      searchFilterVisible: true,
      treeModuleData: [],
      checkedKeys: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 20
      },
      viewTypeList:[],
      categoryList:[],
      tableList:[],
      form: {
        name: undefined,
        genTableName: undefined,
        packageName: undefined,
        moduleName: undefined,
        subModuleName: undefined,
        functionName: undefined,
        functionNameSimple: undefined,
        functionAuthor: undefined,
        genTableId: undefined,
        genCode: undefined,
        replaceFile: undefined,
        syncModule: undefined,
        parentModuleName: undefined,
        parentModuleId: undefined,
        status: undefined,
        description: undefined
      },
      statusOptions: [],
      filterFormText: '',
      dialogFormVisible: false,
      dialogModuleVisible: false,
      showModuleVisible: false,
      schemeAdd: false,
      schemeUpd: false,
      schemeDel: false,
      dialogStatus: 'create',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      isDisabled: {
        0: false,
        1: true
      },
      tableKey: 0
    };
  },
  computed: {
    ...mapGetters(["permissions","dicts"])
  },
  watch: {
    filterFormText(val) {
      this.$refs['formTree'].filter(val);
    }
  },
  created() {
    this.getList();
    this.gen_scheme_edit = this.permissions["gen_scheme_edit"];
    this.gen_table_del = this.permissions["gen_scheme_del"];
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.isAsc = false;
      this.listQuery.queryConditionJson = parseJsonItemForm([{
        fieldName: 'name',value:this.listQuery.name
      },{
        fieldName: 'genTable.name',value:this.listQuery.genTableName
      },{
        fieldName: 'functionName',value:this.listQuery.functionName
      },{
        fieldName: 'functionAuthor',value:this.listQuery.functionAuthor
      }])
      pageGenScheme(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    //搜索清空
    searchReset() {
      this.$refs['searchForm'].resetFields();
    },
    getNodeData(data) {
      this.dialogModuleVisible = false;
      this.form.parentModuleId = data.id;
      this.form.parentModuleName = data.label;
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleModule() {
      fetchMenuTree({extId: this.form.id}).then(response => {
        this.treeModuleData = parseTreeData(response.data);
        this.dialogModuleVisible = true;
      })
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
      this.showModuleVisible=false
      this.dialogStatus = row && !validateNull(row.id)? "update" : "create";
      var params;
      if(this.dialogStatus == "update"){
        params ={id:row.id};
      }
      findGenScheme(params).then(response => {
          var data = response.data;
          this.viewTypeList = data.viewTypeList
          this.categoryList = data.categoryList
          this.tableList = data.tableList
          if(validateNotNull(data.schemeVo)){
            this.resetForm();
            this.form = data.schemeVo;
            console.log(this.form)
            // this.form.genCode = true
            // this.form.replaceFile= false
            // this.form.syncModule=  false
          }
          this.dialogFormVisible = true;
      });
    },
    cancel() {
      this.dialogFormVisible = false;
      this.$refs['form'].resetFields();
    },
    save() {
      const set = this.$refs;
      set['form'].validate(valid => {
        if (valid) {
          // this.form.password = undefined;
          saveGenScheme(this.form).then(response => {
              this.getList();
              this.cancel('form')
          });
        } else {
          return false;
        }
      });
    },
    handleGenCode(row, replaceFile) {
    this.$confirm(
      "此操作将永久生效, 是否继续?",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    ).then(() => {
      genCode({id:row.id, replaceFile: replaceFile}).then(response => {
        this.getList();
      });
    });
  },
    handleDelete(row) {
      this.$confirm(
        "此操作将永久删除该方案(" + row.name + "), 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        removeGenScheme(row.id).then(response => {
            this.getList();
          });
      });
    },
    resetForm() {
      this.form = {
        name: undefined,
        genTableName: undefined,
        packageName: undefined,
        moduleName: undefined,
        subModuleName: undefined,
        functionName: undefined,
        functionNameSimple: undefined,
        functionAuthor: undefined,
        genTableId: undefined,
        genCode: false,
        replaceFile: false,
        syncModule: false,
        parentModuleName: undefined,
        parentModuleId: undefined,
        status: undefined,
        description: undefined
      };
      this.$refs['form']&&this.$refs['form'].resetFields();
    }
  }
};
</script>
