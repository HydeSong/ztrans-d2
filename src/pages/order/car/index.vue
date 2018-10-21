<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem" size="mini">
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
          size="mini"
          v-model="searchItem.appointmentDate"
          type="datetime"
          placeholder="约车时间"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-form-item>
          <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
      <d2-crud
          :columns="columns"
          :index-row="indexRow"
          :data="tableInlineData"
          :pagination="pagination"
          :loading="loading"
          :rowHandle="rowHandle"
          @assign="onAssign"
          @detail="getOrderDetail"/>
      <el-dialog title="指派车辆" :visible.sync="addDialog">
        <el-form :inline="true" :model="searchItemPop" size="mini">
          <el-form-item>
            <el-input v-model="searchItemPop.carPlateNumberSearchKey" placeholder="车牌号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchItemPop.driverNameSearchKey" placeholder="司机姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchItemPop.carTypeSeries" placeholder="车型" clearable>
              <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchItemPop.carSizeSeries" placeholder="尺寸" clearable>
              <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="item.sizeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchPop" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
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
      </el-dialog>
      <el-dialog title="已接单明细" :visible.sync="orderDetailDialog">
        <div class="block" style="text-align: left">
          <el-row>
            <el-col :span="24">
              <ul class="i-list">
                <li>车牌号：{{orderDetail.carPlateNumber}}</li>
                <li>车辆报价：{{orderDetail.carMoney}}元</li>
                <li>
                  <el-form :inline="true" :model="orderDetail" size="mini">
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
            size="mini"
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
          <el-button @click="orderDetailDialog = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="onAssignConfirm" size="mini">确认车辆</el-button>
        </div>
      </el-dialog>
    </template>
  </d2-container>
</template>

<script>
import { getRouterAliaList } from "@/api/schedule";
import {
  getCarTypeList,
  getOrderByCustomerNumId,
  selectDriver,
  confirmDriver,
  getDriverOrderDetail,
  getCarSizeList
} from "@/api/order";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      loading: false,
      indexRow: {
        title: '#'
      },
      columns: [
        {
          title: "订单号",
          key: "series",
          width:"200px"
        },
        {
          title: "线路别名（编号）",
          key: "routerAlisa",
          width:"200px"
        },
        {
          title: "车型",
          key: "carTypeName"
        },
        {
          title: "尺寸",
          key: "carSizeName"
        },
        {
          title: "用车时间",
          key: "appointmentDate",
          width:"200px"
        },
        {
          title: "起步价",
          key: "initPrice"
        },
        {
          title: "客户姓名",
          key: "masterCustomerName",
          width:"200px"
        },
        {
          title: "下单人",
          key: "createOrderName"
        },
        {
          title: "下单时间",
          key: "createOrderTime",
          width:"200px"
        }
      ],
      pagination: {
        pageSize: 10,
        layout: "sizes, prev, pager, next, jumper, ->, total"
      },
      rowHandle: {
        fixed: 'right',
        width: '130',
        custom: [
          {
            text: "指派车辆",
            type: "text",
            size: "mini",
            emit: "assign"
          },
          {
            text: "订单详情",
            type: "text",
            size: "mini",
            emit: "detail"
          }
        ]
      },
      customerNumId: Cookies.get("__user__customernumid"),
      currentPage: 1,
      pageSize: 1000,
      curPage: 1,
      pgSize: 1000,
      routerDetail: [],
      carTypes: [],
      carSizes: [],
      searchItem: {
        carType: "",
        appointmentDate: "",
        customerNameSearchKey: "",
        routerAliaSearchKey: "",
        routerNumberSearchKey: "",
        deliverStatus: 0
      },
      searchItemPop: {
        appointmentDate: "",
        carPlateNumberSearchKey: "",
        carTypeSeries: "",
        carSizeSeries: "",
        driverNameSearchKey: "",
        routerDetailSeries: "",
        series: ""
      },
      driverSeries: "",
      tableData: [],
      addDialog: false,
      orderDetailDialog: false,
      orderDetail: {},
      driverModel: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  computed: {
    totalPage() {
      return this.tableData.length;
    },
    addTotalPage() {
      return this.driverModel.length;
    },
    tableInlineData() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
    tablePopData() {
      this.driverModel.forEach(item => {
        item.district = `${item.prvRealName}/${item.cityRealName}/${
          item.cityAreaRealName
        }`;
      });
      return this.driverModel.slice(
        (this.curPage - 1) * this.pgSize,
        this.curPage * this.pgSize
      );
    }
  },
  created() {
    this._getRouterAliaList({
      customerNumId: this.customerNumId
    });
    this._getCarTypeList({
      customerNumId: this.customerNumId
    });
    this._getCarSizeList({
      customerNumId: this.customerNumId
    });
    this.onSearch();
  },
  methods: {
    _getDriverOrderDetail(params) {
      getDriverOrderDetail(params)
        .then(res => {
          if (res.code === 0) {
            this.orderDetail = res;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _confirmDriver(params) {
      confirmDriver(params)
        .then(res => {
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "指派成功!"
            });
            this.addDialog = false;
            this.orderDetailDialog = false;
            this.onSearch();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _selectDriver(params) {
      selectDriver(params)
        .then(res => {
          if (res.code === 0) {
            this.driverModel = res.driverModel;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getOrderByCustomerNumId(params) {
      this.loading = true;
      getOrderByCustomerNumId(params)
        .then(res => {
          if (res.code === 0) {
            this.tableData = res.orderModel;
            this.loading = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCarTypeList(params) {
      getCarTypeList(params)
        .then(res => {
          if (res.code === 0) {
            this.carTypes = res.carTypes;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getCarSizeList(params) {
      getCarSizeList(params)
        .then(res => {
          if (res.code === 0) {
            this.carSizes = res.carSizes;
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
      };
      this._getOrderByCustomerNumId(params);
    },
    onSearchPop() {
      this._selectDriver({
        current: this.curPage,
        pageSize: this.pgSize,
        customerNumId: this.customerNumId,
        appointmentDate: this.searchItemPop.appointmentDate,
        carPlateNumberSearchKey: this.searchItemPop.carPlateNumberSearchKey,
        carTypeSeries: this.searchItemPop.carTypeSeries,
        carSizeSeries: this.searchItemPop.carSizeSeries,
        driverNameSearchKey: this.searchItemPop.driverNameSearchKey,
        routerDetailSeries: this.searchItemPop.routerDetailSeries
      });
    },
    onAssign({index, row}) {
      this.addDialog = true;
      this.searchItemPop.appointmentDate = row.appointmentDate;
      this.searchItemPop.carTypeSeries = row.carType;
      this.searchItemPop.carSizeSeries = row.carSize;
      this.searchItemPop.routerDetailSeries = row.routerDetailSeries;
      this.searchItemPop.series = row.series;
      // 加载全部数据
      this.onSearchPop();
    },
    getOrderDetail({index, row}) {
      this.$router.push({path:'/order/order-detail',query:{orderId:row.series}});
    },
    onAssignConfirm() {
      if (this.orderDetail.carRealMoney <= this.orderDetail.carMoney) {
        this._confirmDriver({
          carRealMoney: this.orderDetail.carRealMoney,
          customerNumId: this.customerNumId,
          driverSeries: this.driverSeries,
          orderSeries: this.searchItemPop.series
        });
      } else {
        this.$message.error("接单价必须不高于车辆报价！");
      }
    },
    onCheckOrderDetail(index, row) {
      this.orderDetailDialog = true;
      this.driverSeries = row.series;
      this._getDriverOrderDetail({
        customerNumId: this.customerNumId,
        driverSeries: row.series,
        orderSeries: this.searchItemPop.series
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
  .order-price {
    margin: 0;
  }
  .i-list {
    padding: 0;
    margin: 0;
    list-style: none;
    & li {
      padding: 5px 15px;
    }
  }
}
</style>
