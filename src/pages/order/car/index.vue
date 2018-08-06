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
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="onAssign(scope.$index, scope.row)" type="text" size="small">指派车辆</el-button>
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
            <el-button type="primary" @click="onSearchPop" icon="el-icon-search" :loading="searching">查询</el-button>
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
              <el-button @click="onCheckOrderDetail(scope.$index, scope.row)" type="text" size="small">查看已接单明细</el-button>
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
      <el-dialog title="已接单明细" :visible.sync="orderDetailDialog">
        <div class="block" style="text-align: left">
          <el-row>
            <el-col :span="24">
              <ul class="i-list">
                <li>车牌号：{{orderDetail.carPlateNumber}}</li>
                <li>车辆报价：{{orderDetail.carMoney}}元</li>
                <li>
                  <el-form :inline="true" :model="orderDetail">
                    <el-form-item label="接单价" class="order-price">
                      <el-input v-model="orderDetail.carRealMoney" placeholder="请输入"></el-input>
                    </el-form-item>
                  </el-form>
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
        <div class="block" style="text-align: left; padding: 15px">
          已接单任务
        </div>
        <div class="block" style="text-align: left; padding: 15px">
          <el-table
            :data="orderDetail.orderTask"
            highlight-current-row
            style="width: 100%">
            <el-table-column
              fixed
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="series"
              label="订单号">
            </el-table-column>
            <el-table-column
              prop="routerAlia"
              label="线路别名">
            </el-table-column>
            <el-table-column
              prop="customerName"
              label="客户名字">
            </el-table-column>
            <el-table-column
              prop="appointmentDate"
              label="用车时间"
              width="160">
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="orderDetailDialog = false">取 消</el-button>
          <el-button type="primary" @click="onAssignConfirm">确认车辆</el-button>
        </div>
      </el-dialog>
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaList } from '@/api/schedule'
  import { getCarTypeList, getOrderByCustomerNumId, selectDriver, confirmDriver, getDriverOrderDetail } from '@/api/order'
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
          carType: '',
          appointmentDate: '',
          customerNameSearchKey: '',
          routerAliaSearchKey: '',
          routerNumberSearchKey: '',
          deliverStatus: 0
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
        orderDetailDialog: false,
        orderDetail: {},
        driverModel: [],
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
      _getDriverOrderDetail (params) {
        getDriverOrderDetail(params).then(res => {
          if (res.code === 0) {
            this.orderDetail = res
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _confirmDriver (params) {
        confirmDriver(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '指派成功!'
            })
            this.addDialog = false
            this.orderDetailDialog = false
            this.onSearch()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _selectDriver (params) {
        selectDriver(params).then(res => {
          if (res.code === 0) {
            this.driverModel = res.driverModel
          }
        }).catch(err => {
          console.log(err)
        })
      },
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
      onSearchPop () {
        this._selectDriver({
          current: this.curPage,
          pageSize: this.pgSize,
          customerNumId: this.customerNumId,
          appointmentDate: this.searchItemPop.appointmentDate,
          carPlateNumberSearchKey: this.searchItemPop.carPlateNumberSearchKey,
          carTypeSeries: this.searchItemPop.carTypeSeries,
          driverNameSearchKey: this.searchItemPop.driverNameSearchKey,
          routerDetailSeries: this.searchItemPop.routerDetailSeries
        })
      },
      onAssign (index, row) {
        this.addDialog = true
        this.searchItemPop.appointmentDate = row.appointmentDate
        this.searchItemPop.carTypeSeries = row.carType
        this.searchItemPop.routerDetailSeries = row.routerDetailSeries
        this.searchItemPop.series = row.series
        // 加载全部数据
        this.onSearchPop()
      },
      onAssignConfirm (row) {
        this._confirmDriver({
          customerNumId: this.customerNumId,
          driverSeries: row.series,
          orderSeries: this.searchItemPop.series
        })
      },
      onCheckOrderDetail (index, row) {
        this.orderDetailDialog = true
        this.driverSeries = row.series
        this._getDriverOrderDetail({
          customerNumId: this.customerNumId,
          driverSeries: row.series,
          orderSeries: this.searchItemPop.series
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
    .order-price {
      margin: 0
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
