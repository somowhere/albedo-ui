
<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="filter-container">
        <el-form :inline="true">
          <el-form-item label="表名">
            <el-input class="filter-item input-normal" v-model="listQuery.name"></el-input>
          </el-form-item>
          <el-form-item label="说明">
            <el-input class="filter-item input-normal" v-model="listQuery.comments"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button v-if="gen_table_edit" class="filter-item" style="margin-left: 10px;" @click="handleEdit" type="primary" icon="edit">添加</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="加载中..." border fit highlight-current-row style="width: 99%">

        <el-table-column align="center" label="表名">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>


        <el-table-column align="center" label="说明">
          <template slot-scope="scope">
            <span>
              {{scope.row.comments}}
            </span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="类名">
          <template slot-scope="scope">
            <span>{{scope.row.className}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="父表名">
          <template slot-scope="scope">
            <span>{{scope.row.parentTable}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类名">
          <template slot-scope="scope">
            <span>{{scope.row.className}}</span>
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

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-if="gen_table_edit" icon="icon-edit" title="编辑" type="text"  @click="handleEdit(scope.row)">
            </el-button>
            <el-button v-if="gen_table_delete" icon="icon-delete" title="删除" type="text"  @click="handleDelete(scope.row)">
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <el-dialog :title="'选择表'" :visible.sync="dialogBeforeFormVisible">
        <el-form :model="formSelect" ref="formSelect" label-width="100px">
          <el-form-item label="表名" prop="name" :rules="[{required: true,message: '请选择表名'}]">
            <AvueCrudSelect v-model="formSelect.name" :filterable="true" :dic="selectTableList"></AvueCrudSelect>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="this.dialogBeforeFormVisible = false;">取 消</el-button>
          <el-button type="primary" @click="showNextForm()">下一步</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :fullscreen="true">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="名称" prop="name" :rules="[{required: true,message: '请输入名称'}]">
          <el-input v-model="form.name" placeholder="请输名称"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="comments" :rules="[{required: true,message: '请输入说明'}]">
          <el-input v-model="form.comments"></el-input>
        </el-form-item>
        <el-form-item label="类名" prop="className" :rules="[{required: true,message: '请输入类名'}]">
          <el-input v-model="form.className"></el-input>
        </el-form-item>
        <el-form-item label="父表表名" prop="parentTable">
          <AvueCrudSelect v-model="form.parentTable" :dic="tableList"></AvueCrudSelect>
        </el-form-item>
        <el-form-item label="当前表外键" prop="parentTableFk">
          <AvueCrudSelect v-model="form.parentTableFk" :dic="columnList"></AvueCrudSelect>
        </el-form-item>
        <el-form-item label="状态" prop="status" :rules="[{required: true,message: '请选择状态' }]">
          <AvueCrudRadio v-model="form.status" :dic="statusOptions"></AvueCrudRadio>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <table id="contentTable" class="el-table">
          <thead>
          <tr>
            <th title="数据库字段名">列名</th>
            <th title="默认读取数据库字段备注">标题</th>
            <th title="描述字段">说明</th>
            <th title="数据库中设置的字段类型及长度">物理类型</th>
            <th title="实体对象的属性字段类型">Java类型</th>
            <th title="实体对象的属性字段（对象名.属性名|属性名2|属性名3，例如：用户user.id|name|loginName，属性名2和属性名3为Join时关联查询的字段）">
              Java属性名称 <i class="icon-question-sign"></i></th>
            <th title="是否是数据库主键">主键</th>
            <th title="字段是否可为空值，不可为空字段自动进行空值验证">可空</th>
            <th title="字段是否唯一，唯一空字段自动进行唯一性验证">唯一</th>
            <th title="选中后该字段被加入到insert语句里">插入</th>
            <th title="选中后该字段被加入到update语句里">编辑</th>
            <th title="选中后该字段被加入到查询列表里">列表</th>
            <th title="选中后该字段被加入到查询条件里">查询</th>
            <th title="该字段为查询字段时的查询匹配放松">查询匹配方式</th>
            <th title="字段在表单中显示的类型">显示表单类型</th>
            <th title="显示表单类型设置为“下拉框、复选框、点选框”时，需设置字典的类型">字典类型</th>
            <th>排序</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for=" (column,i) in form.columnFormList" :class="column.status=='-1'? 'error':''" :title="column.status=='-1'? '已删除的列，保存之后消失！':''">
            <td>
              <el-input v-model="form.columnFormList[i].name" readonly="readonly" class="input-small"></el-input>
            </td>
            <td>
              <el-input v-model="form.columnFormList[i].title" class="input-small"></el-input>
            </td>
            <td>
              <el-input v-model="form.columnFormList[i].comments" class="input-small"></el-input>
            </td>
            <td>
              <el-input v-model="form.columnFormList[i].jdbcType" class="input-small"></el-input>
            </td>
            <td>
              <AvueCrudSelect v-model="form.columnFormList[i].javaType" class="input-mini" :dic="javaTypeList"></AvueCrudSelect>
            </td>
            <td>
              <el-input v-model="form.columnFormList[i].javaField" class="input-small"></el-input>
            </td>
            <td>
              <el-checkbox v-model="form.columnFormList[i].isPk" :checked="form.columnFormList[i].isPk==1" ></el-checkbox>
            </td>
            <td>
              <el-checkbox v-model="form.columnFormList[i].isNull" :checked="form.columnFormList[i].isNull==1" ></el-checkbox>
            </td>
            <td>
              <el-checkbox v-model="form.columnFormList[i].isUnique" :checked="form.columnFormList[i].isUnique==1" ></el-checkbox>
            </td>
            <td>
              <el-checkbox v-model="form.columnFormList[i].isInsert" :checked="form.columnFormList[i].isInsert==1" ></el-checkbox>
            </td>
            <td>
              <el-checkbox v-model="form.columnFormList[i].isEdit" :checked="form.columnFormList[i].isEdit==1" ></el-checkbox>
            </td>
            <td>
              <el-checkbox v-model="form.columnFormList[i].isList" :checked="form.columnFormList[i].isList==1" ></el-checkbox>
            </td>
            <td>
              <el-checkbox v-model="form.columnFormList[i].isQuery" :checked="form.columnFormList[i].isQuery==1" ></el-checkbox>
            </td>
            <td>
              <AvueCrudSelect v-model="form.columnFormList[i].queryType" class="input-mini" :dic="queryTypeList"></AvueCrudSelect>
            </td>
            <td>
              <AvueCrudSelect v-model="form.columnFormList[i].showType" class="input-mini" :dic="showTypeList"></AvueCrudSelect>
            </td>
            <td>
              <el-input v-model="form.columnFormList[i].dictType" class="input-small"></el-input>
            </td>
            <td>
              <el-input v-model="form.columnFormList[i].sort" class="input-small"></el-input>
            </td>
          </tr>
          </tbody>
        </table>
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
  import {pageTable, findTable, saveTable, removeTable, findSelectTable} from "./service";
  import { mapGetters } from "vuex";
  import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
  import ElOption from "element-ui/packages/select/src/option";
  import {
    objectToString,
    validateNull
  } from "@/util/validate";
  import {parseJsonItemForm} from "@/util/util";
  import {MSG_TYPE_SUCCESS} from "../../../const/common";

  export default {
    components: {
      ElOption,
      ElRadioGroup
    },
    name: "table_get_table",
    data() {
      return{
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          size: 20
        },
        javaTypeList:[],
        queryTypeList:[],
        showTypeList:[],
        tableList:[],
        selectTableList:[],
        columnList:[],
        formSelect:{name:null},
        form: {
          name: undefined,
          comments: undefined,
          className: undefined,
          parentTable: undefined,
          parentTableFk: undefined,
          columnFormList: [],
          status: undefined,
          description: undefined
        },
        statusOptions: [],
        dialogFormVisible: false,
        dialogBeforeFormVisible: false,
        dialogStatus: 'create',
        textMap: {
          update: '编辑表',
          create: '创建表'
        },
        isDisabled: {
          0: false,
          1: true
        },
        tableKey: 0
      };
    },
    computed: {
      ...mapGetters(["authorities","dicts"])
    },
    created() {
      this.getList();
      this.gen_table_edit = this.authorities.indexOf("gen_table_edit") !== -1;
      this.gen_table_delete = this.authorities.indexOf("gen_table_delete") !== -1;
      this.statusOptions = this.dicts["sys_status"];
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.isAsc = false;
        this.listQuery.queryConditionJson = parseJsonItemForm([{
          fieldName: 'name',value:this.listQuery.name
        },{
          fieldName: 'comments',value:this.listQuery.comments
        }])
        pageTable(this.listQuery).then(response => {
          this.list = response.data;
          this.total = response.total;
          this.listLoading = false;
        });
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
          findSelectTable().then(response => {
            this.selectTableList = response.data;
            this.dialogBeforeFormVisible=true;
          });
        }else{
          this.showEditForm({id:row.id})
        }
      },
      showEditForm(params){
        findTable(params).then(response => {
            var data = response.data;
            this.form = data.tableVo;
            this.javaTypeList = data.javaTypeList
            this.queryTypeList = data.queryTypeList
            this.showTypeList = data.showTypeList
            this.tableList = data.tableList
            this.columnList = data.columnList
            this.form.status=objectToString(this.form.status)
            this.dialogBeforeFormVisible = false;
            this.dialogFormVisible = true;
        });
      },
      showNextForm(){
        const set = this.$refs;
        set['formSelect'].validate(valid => {
          if (valid) {
            this.showEditForm({name: this.formSelect.name})
          }
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
            saveTable(this.form).then(response => {
                this.getList();
                this.cancel('form')
            });
          } else {
            return false;
          }
        });
      },
      handleDelete(row) {
        this.$confirm(
          "此操作将永久删除该表(表名:" + row.name + "), 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          removeTable(row.id).then(response => {
              this.getList();
          });
        });
      },
      resetForm() {
        this.form = {
          name: undefined,
          comments: undefined,
          className: undefined,
          parentTable: undefined,
          parentTableFk: undefined,
          columnFormList: [],
          status: undefined,
          description: undefined
        };
        this.$refs['form']&&this.$refs['form'].resetFields();
      }
    }
  };
</script>
