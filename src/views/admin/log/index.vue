

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-row>

        <el-col>
          <div class="filter-container" v-show="searchFilterVisible">
            <el-form :inline="true" :model="listQuery" ref="searchForm">
              <el-form-item label="标题" prop="title">
                <el-input class="filter-item input-normal" size="small" v-model="listQuery.title"></el-input>
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
            </div>
            <div class="table-menu-right">
              <el-button icon="el-icon-search" circle size="mini" @click="searchFilterVisible= !searchFilterVisible"></el-button>
            </div>
          </div>
          <el-table  shadow="hover" :key='tableKey' @sort-change="sortChange" :data="list" v-loading="listLoading" element-loading-text="加载中..." fit highlight-current-row>
            <el-table-column
              type="index" fixed="left" width="50">
            </el-table-column>
            <el-table-column align="center" label="类型" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.type}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="标题" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.title}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="IP地址" width="250">
              <template slot-scope="scope">
              <span>
                {{scope.row.remoteAddr}}
              </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="请求方式" width="120">
              <template slot-scope="scope">
          <span>
            {{scope.row.method}}
          </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="客户端">
              <template slot-scope="scope">
                <el-tag>{{scope.row.serviceId}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="请求时间">
              <template slot-scope="scope">
                <el-tag>{{scope.row.time}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
              <template slot-scope="scope">
                <el-tag>{{scope.row.createTime}}</el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" fixed="right" width="60" v-if="sys_log_delete">
              <template slot-scope="scope">
                <el-button v-if="sys_log_delete" icon="icon-delete" title="删除" type="text" @click="handleDelete(scope.row)">
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
    </basic-container>
  </div>
</template>

<script>
  import { removeLog, pageLog} from "./service";
  import {mapGetters } from 'vuex';
  export default {
    name: 'Log',
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
        sys_log_delete: false,
        currentNode: {},
        tableKey: 0
      }
    },
    watch: {
    },
    created() {
      this.getList()
      this.sys_log_delete = this.permissions["sys_log_del"];
    },
    computed: {
      ...mapGetters([
        "permissions","dicts"
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.params = {"username":this.listQuery.name}
        pageLog(this.listQuery).then(response => {
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
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeLog(row.id).then((rs) => {
            this.getList();
          })
        })
      }
    }
  }
</script>

