<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem">
        <el-form-item>
          <el-select v-model="searchItem.customerSeries" placeholder="客户编号" clearable>
            <el-option v-for="(item, index) in customerMasterList" :key="index" :label="item.customerName" :value="item.customerMasterId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItem.routerNumberSearchKey" placeholder="线路编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchItem.routerDetailAliaSearchKey" placeholder="线路别名" clearable>
            <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" icon="el-icon-search" :loading="searching">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAdd" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableInlineData"
        highlight-current-row
        style="width: 100%"
        stripe>
        <el-table-column
          fixed
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          prop="routerDetailSeries"
          label="线路报价ID">
        </el-table-column>
        <el-table-column
          prop="routerNumber"
          label="线路编号">
        </el-table-column>
        <el-table-column
          prop="routerAlia"
          label="线路别名">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">查看</el-button>
            <el-button @click="onDeleteCustomerPrice(scope.$index, scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
      <el-dialog title="指派车辆" :visible.sync="addDialog">
        <el-form :inline="true" :model="searchItemPop">
          <el-form-item>
            <el-input v-model="searchItemPop.carPlateNumberSearchKey" placeholder="车牌号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchItemPop.driverNameSearchKey" placeholder="司机姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" :loading="searching">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
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
            prop="carPlateNumber"
            label="车牌号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="driverName"
            label="司机姓名">
          </el-table-column>
          <el-table-column
            prop="driverPhone"
            label="手机号"
            width="160">
          </el-table-column>
          <el-table-column
            prop="driverIdentityId"
            label="身份证"
            width="160">
          </el-table-column>
          <el-table-column
            prop="cityName"
            label="起始地->目的地">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="onAssignConfirm(scope.row)" type="text" size="small">确定此人接单</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSzChange"
            @current-change="handleCurChange"
            :current-page="curPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pgSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="addTotalPage">
          </el-pagination>
        </div>
      </el-dialog>
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaList } from '@/api/schedule'
  import { getAllRouterCustomerPrice, getMasterCustomerList, deleteRouterCustomerPrice } from '@/api/price'
  import Cookies from 'js-cookie'
  export default {
    data () {
      return {
        customerNumId: Cookies.get('__user__customernumid'),
        currentPage: 1,
        pageSize: 200,
        curPage: 1,
        pgSize: 100,
        routerDetail: [],
        carTypes: [],
        searchItem: {
          carSizeNameAliaSearchKey: '',
          customerSeries: '',
          routerDetailAliaSearchKey: '',
          routerDetailSeries: '',
          routerNumberSearchKey: '',
          routerType: ''
        },
        searchItemPop: {
          appointmentDate: '',
          carPlateNumberSearchKey: '',
          carTypeSeries: '',
          driverNameSearchKey: '',
          routerDetailSeries: '',
          series: ''
        },
        tableData: [],
        searching: false,
        addDialog: false,
        driverModel: [],
        dialogTableVisible: false,
        innerVisible: false,
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        customerMasterList: []
      }
    },
    computed: {
      totalPage () {
        return this.tableData.length
      },
      addTotalPage () {
        return this.driverModel.length
      },
      tableInlineData () {
        return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      },
      tablePopData () {
        this.driverModel.forEach((item) => {
          item.district = `${item.prvRealName}/${item.cityRealName}/${item.cityAreaRealName}`
        })
        return this.driverModel.slice((this.curPage - 1) * this.pgSize, this.curPage * this.pgSize)
      }
    },
    created () {
      this._getRouterAliaList({
        customerNumId: this.customerNumId
      })
      this._getMasterCustomerList({
        customerNumId: this.customerNumId,
        saleId: ''
      })
      this.onSearch()
    },
    methods: {
      _deleteRouterCustomerPrice (params, index) {
        deleteRouterCustomerPrice(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.tableData.splice(index, 1)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getMasterCustomerList (params) {
        getMasterCustomerList(params).then(res => {
          if (res.code === 0) {
            this.customerMasterList = res.customerMasterList
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllRouterCustomerPrice (params) {
        getAllRouterCustomerPrice(params).then(res => {
          if (res.code === 0) {
            this.tableData = res.allRouterPriceGetModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getRouterAliaList (params) {
        getRouterAliaList(params).then(res => {
          if (res.code === 0) {
            this.routerDetail = res.routerDetail
          }
        }).catch(err => {
          console.log(err)
        })
      },
      onSearch () {
        this._getAllRouterCustomerPrice({
          current: this.currentPage,
          pageSize: this.pageSize,
          customerNumId: this.customerNumId,
          carSizeNameAliaSearchKey: this.searchItem.carSizeNameAliaSearchKey,
          customerSeries: this.searchItem.customerSeries,
          routerDetailAliaSearchKey: this.searchItem.routerDetailAliaSearchKey,
          routerDetailSeries: this.searchItem.routerDetailSeries,
          routerNumberSearchKey: this.searchItem.routerNumberSearchKey,
          routerType: this.searchItem.routerType
        })
      },
      onAdd () {
      },
      onDeleteCustomerPrice (index, row) {
        console.log(row)
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._deleteRouterCustomerPrice({
            customerNumId: this.customerNumId,
            routerPriceId: row.routerDetailSeries
          }, index)
        }).catch(() => {
          console.log('取消删除')
        })
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
        this.pageSize = val
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        this.currentPage = val
        // this._getAllRouterAndEmployee({
        //   current: this.currentPage,
        //   customerNumId: this.customerNumId,
        //   employeeNameSearchKey: this.searchItem.employeeNameSearchKey,
        //   pageSize: val,
        //   routerDetailAliaSearchKey: this.searchItem.routerDetailAliaSearchKey
        // })
      },
      handleSzChange (val) {
        this.pgSize = val
      },
      handleCurChange (val) {
        this.curPage = val
        // this._getAllEmployee({
        //   current: this.curPage,
        //   customerNumId: this.customerNumId,
        //   employeeJobNumSearchKey: '',
        //   employeeNameSearchKey: '',
        //   jobId: 0,
        //   pageSize: this.pgSize
        // })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    .block {
      padding: 10px 0;
      text-align: right;
    }
  }
</style>
