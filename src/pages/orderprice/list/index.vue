<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem">
        <el-form-item>
          <el-input v-model="searchItem.carPlateNumberSearchKey" placeholder="车牌号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItem.customerNameSearchKey" placeholder="客户名字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchItem.routerDetailSeries" placeholder="线路别名" clearable>
            <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>
          </el-select>
        </el-form-item>
        <el-date-picker
          v-model="searchItem.time"
          @change="onTimeChange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
        <el-form-item>
          <el-button type="primary" @click="onSearch" icon="el-icon-search" :loading="searching">查询</el-button>
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
          prop="series"
          label="订单号">
        </el-table-column>
        <el-table-column
          width="140"
          prop="carTypeName"
          label="车型">
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户名字">
        </el-table-column>
        <el-table-column
          prop="carPlateNumber"
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="driverName"
          label="司机名字">
        </el-table-column>
        <el-table-column
          prop="routerAlia"
          label="线路别名">
        </el-table-column>
        <el-table-column
          prop="appointmentDate"
          label="预约时间">
        </el-table-column>
        <el-table-column
          prop="saleName"
          label="销售员">
        </el-table-column>
        <el-table-column
          prop="orderMoney"
          label="客户应付">
        </el-table-column>
        <el-table-column
          prop="driverMoney"
          label="司机应收">
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="platformMoney"-->
          <!--label="平台利润">-->
        <!--</el-table-column>-->
      </el-table>
      <div class="pagination-wrapper">
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
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaList } from '@/api/schedule'
  import { getOrderPriceList } from '@/api/orderprice'
  import Cookies from 'js-cookie'
  export default {
    data () {
      return {
        customerNumId: Cookies.get('__user__customernumid'),
        currentPage: 1,
        pageSize: 200,
        searchItem: {
          carPlateNumberSearchKey: '',
          customerNameSearchKey: '',
          routerDetailSeries: '',
          endTime: '',
          startTime: '',
          time: ''
        },
        routerDetail: [],
        tableData: [],
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        searching: false
      }
    },
    computed: {
      totalPage () {
        return this.tableData.length
      },
      tableInlineData () {
        return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      }
    },
    created () {
      this._getRouterAliaList({
        customerNumId: this.customerNumId
      })
      // 进入页面加载全部数据
      this.onSearch()
    },
    methods: {
      _getRouterAliaList (params) {
        getRouterAliaList(params).then(res => {
          if (res.code === 0) {
            this.routerDetail = res.routerDetail
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getOrderPriceList (params) {
        getOrderPriceList(params).then(res => {
          if (res.code === 0) {
            this.searching = false
            this.tableData = res.orderPriceModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      onSearch () {
        this.searching = true
        this._getOrderPriceList({
          current: this.currentPage,
          pageSize: this.pageSize,
          customerNumId: this.customerNumId,
          carPlateNumberSearchKey: this.searchItem.carPlateNumberSearchKey,
          customerNameSearchKey: this.searchItem.customerNameSearchKey,
          routerDetailSeries: this.searchItem.routerDetailSeries,
          endTime: this.searchItem.endTime,
          startTime: this.searchItem.startTime
        })
      },
      onTimeChange (time) {
        this.searchItem.startTime = time[0]
        this.searchItem.endTime = time[1]
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    .block {
      padding: 10px 30px;
      text-align: left;
    }
    .pagination-wrapper {
      padding: 10px 0;
      text-align: right;
    }
    .i-list {
      padding: 0;
      margin: 0;
      list-style: none;
      & li{
        padding: 5px 15px;
      }
    }
  }
</style>
