<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem">
        <el-form-item>
          <el-input v-model="searchItem.customerNameSearchKey" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItem.routerNumberSearchKey" placeholder="线路编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchItem.routerAliaSearchKey" placeholder="线路别名" clearable>
            <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchItem.carType" placeholder="车型" clearable>
            <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-date-picker
          v-model="searchItem.appointmentDate"
          type="datetime"
          placeholder="约车时间"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions">
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
          prop="routerAlisa"
          label="线路别名（编号）">
        </el-table-column>
        <el-table-column
          prop="driverName"
          label="司机姓名">
        </el-table-column>
        <el-table-column
          prop="carPlateNumber"
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="carTypeName"
          label="车型">
        </el-table-column>
        <el-table-column
          prop="wetherTakeover"
          label="需要搬卸">
        </el-table-column>
        <el-table-column
          prop="appointmentDate"
          label="用车时间">
        </el-table-column>
        <el-table-column
          prop="initPrice"
          label="起步价">
        </el-table-column>
        <el-table-column
          prop="overstepPrice"
          label="超出价格">
        </el-table-column>
        <el-table-column
          prop="masterCustomerName"
          label="客户姓名">
        </el-table-column>
        <el-table-column
          prop="sendGoodsLocationNum"
          label="发货/收货点数">
        </el-table-column>
        <el-table-column
          prop="createOrderName"
          label="下单人">
        </el-table-column>
        <el-table-column
          prop="createOrderTime"
          label="下单时间">
        </el-table-column>
        <el-table-column
          prop="sendGoodsPersonName"
          label="发货人">
        </el-table-column>
        <el-table-column
          prop="sendAddressDetail"
          label="发货详细地址">
        </el-table-column>
        <el-table-column
          prop="sendGoodsPersonMobile"
          label="发货人联系电话">
        </el-table-column>
        <el-table-column
          prop="receiveGoodsPersonName"
          label="收货人">
        </el-table-column>
        <el-table-column
          prop="receiveAddressDetail"
          label="收货详细地址">
        </el-table-column>
        <el-table-column
          prop="receiveGoodsPersonMobile"
          label="收货人联系电话">
        </el-table-column>
        <el-table-column
          prop="goodsRemark"
          label="货物描述">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="补充信息">
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
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaList } from '@/api/schedule'
  import { getCarTypeList, getOrderByCustomerNumId } from '@/api/order'
  import Cookies from 'js-cookie'
  export default {
    data () {
      return {
        customerNumId: Cookies.get('__user__customernumid'),
        currentPage: 1,
        pageSize: 200,
        routerDetail: [],
        carTypes: [],
        searchItem: {
          carType: '',
          appointmentDate: '',
          customerNameSearchKey: '',
          routerAliaSearchKey: '',
          routerNumberSearchKey: '',
          deliverStatus: 1
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
        }
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
      this._getCarTypeList({
        customerNumId: this.customerNumId
      })
      this._getOrderByCustomerNumId({
        current: this.currentPage,
        pageSize: 1000,
        customerNumId: this.customerNumId,
        deliverStatus: this.searchItem.deliverStatus,
        carType: this.searchItem.carType,
        appointmentDate: this.searchItem.appointmentDate,
        customerNameSearchKey: this.searchItem.customerNameSearchKey,
        routerAliaSearchKey: this.searchItem.routerAliaSearchKey,
        routerNumberSearchKey: this.searchItem.routerNumberSearchKey
      })
    },
    methods: {
      _getOrderByCustomerNumId (params) {
        console.log(params)
        getOrderByCustomerNumId(params).then(res => {
          if (res.code === 0) {
            this.tableData = res.orderModel
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getCarTypeList (params) {
        getCarTypeList(params).then(res => {
          if (res.code === 0) {
            this.carTypes = res.carTypes
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
        const params = {
          current: this.currentPage,
          pageSize: this.pageSize,
          customerNumId: this.customerNumId,
          deliverStatus: this.searchItem.deliverStatus,
          carType: this.searchItem.carType,
          appointmentDate: this.searchItem.appointmentDate,
          customerNameSearchKey: this.searchItem.customerNameSearchKey,
          routerAliaSearchKey: this.searchItem.routerAliaSearchKey,
          routerNumberSearchKey: this.searchItem.routerNumberSearchKey
        }
        this._getOrderByCustomerNumId(params)
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
      padding: 10px 0;
      text-align: right;
    }
  }
</style>
