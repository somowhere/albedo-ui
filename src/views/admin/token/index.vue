

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-row>

        <el-col>
          <div class="filter-container" v-show="searchFilterVisible">
            <el-form :inline="true" :model="listQuery"  ref="searchForm">
              <el-form-item label="名称" prop="username">
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
            </div>
            <div class="table-menu-right">
              <el-button icon="el-icon-search" circle size="small" @click="searchFilterVisible= !searchFilterVisible"></el-button>
            </div>
          </div>
          <el-table  shadow="hover" :key='tableKey' @sort-change="sortChange" :data="list" v-loading="listLoading" element-loading-text="加载中..." fit highlight-current-row>
            <el-table-column
              type="index" fixed="left" width="50">
            </el-table-column>
            <el-table-column align="center" label="用户ID" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.user_id}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="用户名" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.username}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="令牌" width="250">
              <template slot-scope="scope">
              <span>
                {{scope.row.access_token}}
              </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="类型" width="120">
              <template slot-scope="scope">
          <span>
            {{scope.row.token_type}}
          </span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="过期时间">
              <template slot-scope="scope">
                <el-tag>{{scope.row.expires_in}}</el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" fixed="right" width="60" v-if="sys_token_delete">
              <template slot-scope="scope">
                <el-button v-if="sys_token_delete" icon="icon-delete" title="删除" type="text" @click="handleDelete(scope.row)">
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
  import { removeToken, pageToken} from "./service";
  import {mapGetters } from 'vuex';
  import {parseJsonItemForm} from "@/util/util";
  import {MSG_TYPE_SUCCESS} from "../../../const/common";
  export default {
    name: 'Token',
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
        sys_token_delete: false,
        currentNode: {},
        tableKey: 0
      }
    },
    watch: {
    },
    created() {
      this.getList()
      this.sys_token_delete = this.permissions["sys_token_del"];
    },
    computed: {
      ...mapGetters([
        "permissions","dicts"
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.params = {"username":this.listQuery.username}
        pageToken(this.listQuery).then(response => {
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
          removeToken(row.id).then(response =>{
              this.getList();
          })
        })
      }
    }
  }
</script>

