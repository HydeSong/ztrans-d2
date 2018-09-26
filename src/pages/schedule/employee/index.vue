<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem" size="mini">
        <el-form-item>
          <el-select v-model="searchItem.routerDetailAliaSearchKey" placeholder="线路别名" clearable>
            <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItem.employeeNameSearchKey" placeholder="调度人姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAdd" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
      <d2-crud
            :columns="columns"
            :data="tableInlineData"
            :pagination="pagination"
            :loading="loading"
            :rowHandle="rowHandle"
            @delete="onDelete"/>
      <el-dialog title="新增调度人" :visible.sync="addDialog">
        <el-table
          size="mini"
          :data="tablePopData"
          highlight-current-row
          style="width: 100%"
          height="400">
          <el-table-column
            fixed
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="customerName"
            label="调度人姓名"
            width="100">
          </el-table-column>
          <el-table-column
            prop="birthday"
            label="生日">
          </el-table-column>
          <el-table-column
            prop="jobNum"
            label="工号">
          </el-table-column>
          <el-table-column
            prop="sexRealName"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="jobRealName"
            label="职位">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="60">
            <template slot-scope="scope">
              <el-button @click="onAddRouterToEmployee(scope.row)" type="text" size="small">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          width="18%"
          title="线路别名"
          :visible.sync="innerVisible"
          append-to-body>
          <el-form :inline="true" :model="searchItem" size="mini">
            <el-form-item>
              <el-select v-model="addItemParam.routerDetailSeries" placeholder="线路别名" clearable>
                <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.series"></el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="onAddRouterToEmployeeComfirm" size="mini">确定</el-button>
          </el-form>
        </el-dialog>
      </el-dialog>
    </template>
  </d2-container>
</template>

<script>
import {
  getRouterAliaList,
  getAllRouterAndEmployee,
  deleteRouterAndEmployee,
  addRouterToEmployee
} from "@/api/schedule";
import { getAllEmployee } from "@/api/employee";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      loading: false,
      columns: [
        {
          title: "线路别名",
          key: "routerAlia"
        },
        {
          title: "调度人姓名",
          key: "customerName"
        }
      ],
      pagination: {
        pageSize: 10,
        layout: "sizes, prev, pager, next, jumper, ->, total"
      },
      rowHandle: {
        custom: [
          {
            text: "删除",
            type: "text",
            size: "mini",
            emit: "delete"
          }
        ]
      },
      customerNumId: Cookies.get("__user__customernumid"),
      currentPage: 1,
      pageSize: 20,
      curPage: 1,
      pgSize: 10,
      routerDetail: [],
      searchItem: {
        routerDetailAliaSearchKey: "",
        employeeNameSearchKey: ""
      },
      addItemParam: {
        routerDetailSeries: "",
        employeeNumId: ""
      },
      tableData: [],
      addDialog: false,
      baseCustomers: [],
      dialogTableVisible: false,
      innerVisible: false
    };
  },
  computed: {
    totalPage() {
      return this.tableData.length;
    },
    addTotalPage() {
      return this.baseCustomers.length;
    },
    tableInlineData() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    tablePopData() {
      return this.baseCustomers.slice(
        (this.curPage - 1) * this.pgSize,
        this.curPage * this.pgSize
      );
    }
  },
  created() {
    this._getRouterAliaList({
      customerNumId: this.customerNumId
    });
    this._getAllRouterAndEmployee({
      current: this.currentPage,
      customerNumId: this.customerNumId,
      employeeNameSearchKey: this.searchItem.employeeNameSearchKey,
      pageSize: 1000,
      routerDetailAliaSearchKey: this.searchItem.routerDetailAliaSearchKey
    });
  },
  methods: {
    _addRouterToEmployee(params) {
      addRouterToEmployee(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "添加成功!"
            });
            this.addDialog = false;
            this.onSearch();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getAllEmployee(params) {
      getAllEmployee(params)
        .then(res => {
          if (res.code === 0) {
            this.baseCustomers = res.baseCustomers;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _deleteRouterAndEmployee(params, index) {
      deleteRouterAndEmployee(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.tableData.splice(index, 1);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getAllRouterAndEmployee(params) {
      getAllRouterAndEmployee(params)
        .then(res => {
          if (res.code === 0) {
            this.tableData = res.employeeRouterModel;
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getRouterAliaList(params) {
      getRouterAliaList(params)
        .then(res => {
          if (res.code === 0) {
            this.routerDetail = res.routerDetail;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSearch() {
      this.loading = true;
      const params = {
        current: this.currentPage,
        customerNumId: this.customerNumId,
        employeeNameSearchKey: this.searchItem.employeeNameSearchKey,
        pageSize: this.pageSize,
        routerDetailAliaSearchKey: this.searchItem.routerDetailAliaSearchKey
      };
      this._getAllRouterAndEmployee(params);
    },
    onAdd() {
      this.addDialog = true;
      this._getAllEmployee({
        current: this.curPage,
        customerNumId: this.customerNumId,
        employeeJobNumSearchKey: "",
        employeeNameSearchKey: "",
        jobId: 0,
        pageSize: 1000
      });
    },
    onAddRouterToEmployee(row) {
      console.log(row);
      this.innerVisible = true;
      this.addItemParam.employeeNumId = row.customerNumId;
    },
    onAddRouterToEmployeeComfirm() {
      this.innerVisible = false;
      this._addRouterToEmployee({
        customerNumId: this.customerNumId,
        employeeNumId: this.addItemParam.employeeNumId,
        routerDetailSeries: this.addItemParam.routerDetailSeries
      });
    },
    onDelete({ index, row }) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteRouterAndEmployee(
            {
              customerNumId: this.customerNumId,
              series: row.series
            },
            index
          );
        })
        .catch(() => {
          console.log("取消删除");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  .block {
    padding: 10px 0;
    text-align: right;
  }
}
</style>
