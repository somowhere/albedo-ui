<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <div class="filter-container">
        <el-form :inline="true" :model="searchClientForm" ref="searchClientForm" v-show="searchFilterVisible">
          <el-form-item label="客户端ID" prop="clientId">
            <el-input class="filter-item input-normal" v-model="searchClientForm.clientId"></el-input>
          </el-form-item>
          <el-form-item label="作用域" prop="scope">
            <el-input class="filter-item input-normal" v-model="searchClientForm.scope"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleFilter" icon="el-icon-search" size="small" type="primary">查询</el-button>
            <el-button @click="searchReset" icon="el-icon-delete" size="small">清空</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格功能列 -->
      <div class="table-menu">
        <div class="table-menu-left">
          <el-button-group>
            <el-button @click="handleEdit" class="filter-item" icon="edit" size="mini" type="primary"
                       v-if="sys_client_edit">添加
            </el-button>
          </el-button-group>
        </div>
        <div class="table-menu-right">
          <el-button @click="searchFilterVisible= !searchFilterVisible" circle icon="el-icon-search"
                     size="mini"></el-button>
        </div>
      </div>
      <el-table :data="list" :key='tableKey' @sort-change="sortChange" element-loading-text="加载中..."
                fit highlight-current-row v-loading="listLoading">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left">
              <el-form-item label="重定向地址">
                <span>{{scope.row.webServerRedirectUri}}</span>
              </el-form-item>
              <el-form-item label="权限">
                <span>{{scope.row.authorities}}</span>
              </el-form-item>
              <el-form-item label="请求令牌有效时间">
                <span>{{scope.row.accessTokenValidity}}</span>
              </el-form-item>
              <el-form-item align="center" label="刷新令牌有效时间">
                <span>{{scope.row.refreshTokenValidity}}</span>
              </el-form-item>
              <el-form-item align="center" label="扩展信息">
                <span>{{scope.row.additionalInformation}}</span>
              </el-form-item>
              <el-form-item align="center" label="资源ID">
                <span>{{scope.row.resourceIds}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" label="客户端ID" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.clientId}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="客户端密钥" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.clientSecret}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="作用域" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.scope}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否自动放行" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.autoapprove}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="授权方式">
          <template slot-scope="scope">
            <span>{{scope.row.authorizedGrantTypes}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" v-if="sys_client_edit || sys_client_del" width="130">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" icon="icon-edit" title="编辑" type="text" v-if="sys_client_edit">
            </el-button>
            <el-button @click="handleDelete(scope.row)" icon="icon-delete" title="删除" type="text" v-if="sys_client_del">
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <div class="pagination-container" v-show="!listLoading">
        <el-pagination :current-page.sync="listQuery.page" :page-size="listQuery.size"
                       :page-sizes="[10,20,30, 50]" :total="total" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :model="form" label-width="100px" ref="form">
          <el-table-column fixed="left" type="index" width="60"></el-table-column>
          <el-form-item :rules="[{required: true,message: '请输入客户端ID'},{min: 0,max: 32,message: '长度在 0 到 32 个字符'},]" label="客户端ID"
                        prop="clientId">
            <el-input v-model="form.clientId"></el-input>
          </el-form-item>
          <el-form-item :rules="[{required: true,message: '请输入客户端密钥'},{min: 0,max: 256,message: '长度在 0 到 256 个字符'},]" label="客户端密钥"
                        prop="clientSecret">
            <el-input v-model="form.clientSecret"></el-input>
          </el-form-item>
          <el-form-item :rules="[{required: true,message: '请输入作用域'},{min: 0,max: 256,message: '长度在 0 到 256 个字符'},]" label="作用域"
                        prop="scope">
            <el-input v-model="form.scope"></el-input>
          </el-form-item>
          <el-form-item :rules="[{required: true,message: '请输入是否自动放行'},{min: 0,max: 256,message: '长度在 0 到 256 个字符'},]" label="是否自动放行"
                        prop="autoapprove">
            <el-input v-model="form.autoapprove"></el-input>
          </el-form-item>
          <el-form-item :rules="[{required: true,message: '请输入授权方式'},{min: 0,max: 256,message: '长度在 0 到 256 个字符'},]" label="授权方式"
                        prop="authorizedGrantTypes">
            <el-input v-model="form.authorizedGrantTypes"></el-input>
          </el-form-item>
          <el-form-item :rules="[{min: 0,max: 256,message: '长度在 0 到 256 个字符'},]" label="重定向地址"
                        prop="webServerRedirectUri">
            <el-input v-model="form.webServerRedirectUri"></el-input>
          </el-form-item>
          <el-form-item :rules="[{min: 0,max: 256,message: '长度在 0 到 256 个字符'},]" label="权限" prop="authorities">
            <el-input v-model="form.authorities"></el-input>
          </el-form-item>
          <el-form-item :rules="[{validator:validateDigits},]" label="请求令牌有效时间" prop="accessTokenValidity">
            <el-input v-model="form.accessTokenValidity"></el-input>
          </el-form-item>
          <el-form-item :rules="[{validator:validateDigits},]" label="刷新令牌有效时间" prop="refreshTokenValidity">
            <el-input v-model="form.refreshTokenValidity"></el-input>
          </el-form-item>
          <el-form-item :rules="[{min: 0,max: 4096,message: '长度在 0 到 4096 个字符'},]" label="扩展信息"
                        prop="additionalInformation">
            <el-input v-model="form.additionalInformation"></el-input>
          </el-form-item>
          <el-form-item :rules="[{min: 0,max: 256,message: '长度在 0 到 256 个字符'},]" label="资源ID" prop="resourceIds">
            <el-input v-model="form.resourceIds"></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-button @click="cancel()" size="small">取 消</el-button>
          <el-button @click="save()" size="small" type="primary">保 存</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import clientService from "./client-service";
    import validate from "@/util/validate";
    import util from "@/util/util";
    import CrudSelect from "@/components/avue/crud-select";
    import CrudCheckbox from "@/components/avue/crud-checkbox";
    import CrudRadio from "@/components/avue/crud-radio";

    export default {
        name: "table_sys_client",
        components: {CrudSelect, CrudCheckbox, CrudRadio},
        data() {
            return {
                searchFilterVisible: true,
                dialogFormVisible: false,
                list: null,
                total: null,
                listLoading: true,
                searchClientForm: {},
                listQuery: {
                    page: 1,
                    size: 20
                },
                form: {
                    clientId: undefined,
                    clientSecret: undefined,
                    scope: undefined,
                    autoapprove: undefined,
                    authorizedGrantTypes: undefined,
                    webServerRedirectUri: undefined,
                    authorities: undefined,
                    accessTokenValidity: undefined,
                    refreshTokenValidity: undefined,
                    additionalInformation: undefined,
                    resourceIds: undefined,
                },
                validateUnique: (rule, value, callback) => {
                    clientService.validateUnique(rule, value, callback, this.form.id)
                },
                validateNumber: (rule, value, callback) => {
                    validate.isNumber(rule, value, callback)
                },
                validateDigits: (rule, value, callback) => {
                    validate.isDigits(rule, value, callback)
                },
                dialogStatus: 'create',
                textMap: {
                    update: '编辑终端',
                    create: '创建终端'
                },
                tableKey: 0
            };
        },
        computed: {
            ...mapGetters(["permissions", "dicts"])
        },
        filters: {},
        created() {
            this.getList();
            this.sys_client_edit = this.permissions["sys_client_edit"];
            this.sys_client_del = this.permissions["sys_client_del"];
        },
        methods: {
            getList() {
                this.listLoading = true;
                this.listQuery.queryConditionJson = util.parseJsonItemForm([
                    {fieldName: 'clientId', value: this.searchClientForm.clientId},
                    {fieldName: 'scope', value: this.searchClientForm.scope},
                ]);
                clientService.page(this.listQuery).then(response => {
                    this.list = response.data.records;
                    this.total = response.data.total;
                    this.listLoading = false;
                });
            },
            sortChange(column) {
                if (column.order == "ascending") {
                    this.listQuery.ascs = column.prop;
                    this.listQuery.descs = undefined;
                } else {
                    this.listQuery.descs = column.prop;
                    this.listQuery.ascs = undefined;
                }
                this.getList()
            },
            searchReset() {
                this.$refs['searchClientForm'].resetFields();
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
                console.log(row);
                this.resetForm();
                this.dialogStatus = row && validate.checkNotNull(row.clientId) ? "update" : "create";
                if (this.dialogStatus == "create") {
                    this.dialogFormVisible = true;
                } else {
                    clientService.find(row.clientId).then(response => {
                        this.form = response.data;
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
                        clientService.save(this.form).then((data) => {
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
                    "此操作将永久删除该终端, 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    clientService.remove(row.clientId).then((data) => {
                        this.getList();
                    });
                });
            },
            resetForm() {
                this.form = {
                    clientId: "",
                    clientSecret: "",
                    scope: "",
                    autoapprove: "",
                    authorizedGrantTypes: "",
                    webServerRedirectUri: "",
                    authorities: "",
                    accessTokenValidity: "",
                    refreshTokenValidity: "",
                    additionalInformation: "",
                    resourceIds: "",
                };
                this.$refs['form'] && this.$refs['form'].resetFields();
            }
        }
    };
</script>
