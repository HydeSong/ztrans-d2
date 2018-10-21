<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem" size="large" >
        <el-form-item label="订单号" >
          <el-input v-model="orderId" placeholder="请输入订单号" style="width:200px"></el-input>
        </el-form-item>
      <el-form-item style="width:200px">
        <el-button type="primary" @click="getOrder()"   icon="el-icon-search" :loading="searching">查询订单</el-button>
      </el-form-item>
      </el-form>

      <el-form :inline="true" :model="searchItem" size="large" >
        <el-form-item label="订单号" >
          <el-input v-model="order.series"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="线路别名" >
          <el-input v-model="order.routerAlisa"   style="width:300px" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单状态" >
          <el-input v-model="order.deliverStatus"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单结算状态" >
          <el-input v-model="order.orderBalanceStatus"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单类型" >
          <el-input v-model="order.orderType"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单车辆车型" >
          <el-input v-model="order.carTypeName"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单车辆尺寸" >
          <el-input v-model="order.carSizeName"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="需要搬卸" >
          <el-input v-model="order.wetherTakeover"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="用车时间" >
          <el-input v-model="order.appointmentDate"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户名称" >
          <el-input v-model="order.masterCustomerName"   style="width:250px" disabled></el-input>
        </el-form-item>
        <el-form-item label="下单人名字" >
          <el-input v-model="order.createOrderName"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="经停站点" >
          <el-input v-model="order.routerStations"   style="width:200px" disabled></el-input>
        </el-form-item>

        <el-form-item label="下单时间" >
          <el-input v-model="order.createOrderTime"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单金额" >
          <el-input v-model="order.orderMoney"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="发货地址详情" >
          <el-input v-model="order.sendAddressDetail"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="发货人" >
          <el-input v-model="order.sendGoodsPersonName"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="发货人联系电话" >
          <el-input v-model="order.sendGoodsPersonMobile"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货人联系电话" >
          <el-input v-model="order.receiveGoodsPersonMobile"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货人" >
          <el-input v-model="order.receiveGoodsPersonName"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="收货地址详情" >
          <el-input v-model="order.receiveAddressDetail"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="车牌号" >
          <el-input v-model="order.carPlateNumber"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机名字" >
          <el-input v-model="order.driverName"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机电话" >
          <el-input v-model="order.driverPhone"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机身份证" >
          <el-input v-model="order.driverIdentityId"   style="width:200px" disabled></el-input>
        </el-form-item>

        <el-form-item label="司机获得价格" >
          <el-input v-model="order.driverMoney"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机交接单" >
          <el-input v-model="order.driverReceitp"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机额外费用" >
          <el-input v-model="order.driverAddFee"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车辆尺寸" >
          <el-input v-model="order.driverCarSizeRealName"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车辆车型" >
          <el-input v-model="order.driverCarTypeRealName"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车辆品牌" >
          <el-input v-model="order.driverCarBrandRealName"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机车辆重量" >
          <el-input v-model="order.driverCarWeightRealName"   style="width:200px" disabled></el-input>
        </el-form-item>
        <el-form-item label="线路起始地" >
          <el-input v-model="order.routerSource"   style="width:400px" disabled></el-input>
        </el-form-item>
        <el-form-item label="线路目的地" style="width:700px">
          <el-input v-model="order.routerDestination"   style="width:400px" disabled></el-input>
        </el-form-item>
        <el-form-item label="货物描述" >
          <el-input type="textarea" v-model="order.goodsRemark"  :rows="7"  style="width:400px" disabled></el-input>
        </el-form-item>
        <el-form-item label="下单人备注" >
          <el-input type="textarea" v-model="order.remark"   :rows="7" style="width:400px" disabled></el-input>
        </el-form-item>
        <el-form-item label="司机备注" >
          <el-input type="textarea" v-model="order.driverRemark"  :rows="7"  style="width:400px" disabled></el-input>
        </el-form-item>
      </el-form>
    </template>
  </d2-container>
</template>

<script>
import {
  getOrderDetailBySeries
} from "@/api/order";

import Cookies from "js-cookie";
export default {
  data() {
    return {
      value5: "",
      customerNumId: Cookies.get("__user__customernumid"),
      orderId: "",
      order: {
        series:"",
        routerAlisa:"",
        carTypeName: "",
        carSizeName: "",
        wetherTakeover: "",
        appointmentDate: "",
        masterCustomerName: "",
        createOrderName: "",
        routerStations: [],
        goodsRemark: "",
        remark:"",
        createOrderTime: "",
        sendAddressDetail: "",
        sendGoodsPersonName: "",
        sendGoodsPersonMobile: "",
        receiveGoodsPersonMobile: "",
        receiveGoodsPersonName: "",
        receiveAddressDetail: "",
        carPlateNumber: "",
        driverName: "",
        driverPhone: "",
        driverIdentityId: "",
        orderMoney: "",
        driverMoney: "",
        deliverStatus: "",
        orderBalanceStatus: "",
        orderType: "",
        driverRemark: "",
        driverReceitp: "",
        driverAddFee: "",
        driverCarSizeRealName: "",
        driverCarTypeRealName: "",
        driverCarBrandRealName: "",
        driverCarWeightRealName: "",
        routerSource: "",
        routerDestination: "",
      }
    };
  },

  created() {
    this.orderId = this.$route.query.orderId;
    if (!this.orderId == "") {
    this.getOrder()
    {
      this._getOrderDetailBySeries({
        customerNumId: this.customerNumId,
        series: this.orderId
      });
    }
  }
  },
  watch: {

  },
  methods: {
    getOrder(){
     this. _getOrderDetailBySeries({
        customerNumId: this.customerNumId,
        series: this.orderId});

  },
    _getOrderDetailBySeries(params) {
      getOrderDetailBySeries(params)
        .then(res => {
        if (res.code === 0) {
        this.order.series=res.series;
        this.order.routerAlisa=res.routerAlisa;
        this.order.carTypeName=res.carTypeName;
        this.order.carSizeName=res.carSizeName;
        this.order.wetherTakeover=res.wetherTakeover;
        this.order.appointmentDate=res.appointmentDate;
        this.order.masterCustomerName=res.masterCustomerName;
        this.order.createOrderName=res.createOrderName;
        this.order.routerStations=res.routerStations;
        this.order.goodsRemark=res.goodsRemark;
        this.order.remark=res.remark;
        this.order.createOrderTime=res.createOrderTime;
        this.order.sendAddressDetail=res.sendAddressDetail;
        this.order.sendGoodsPersonName=res.sendGoodsPersonName;
        this.order.sendGoodsPersonMobile=res.sendGoodsPersonMobile;
        this.order.receiveGoodsPersonMobile=res.receiveGoodsPersonMobile;
        this.order.receiveGoodsPersonName=res.receiveGoodsPersonName;
        this.order.receiveAddressDetail=res.receiveAddressDetail;
        this.order.carPlateNumber=res.carPlateNumber;
        this.order.driverName=res.driverName;
        this.order.driverPhone=res.driverPhone;
        this.order.driverIdentityId=res.driverIdentityId;
        this.order.orderMoney=res.orderMoney;
        this.order.driverMoney=res.driverMoney;
        this.order.deliverStatus=res.deliverStatus;
        this.order.orderBalanceStatus=res.orderBalanceStatus;
        this.order.orderType=res.orderType;
        this.order.driverRemark=res.driverRemark;
        this.order.driverReceitp=res.driverReceitp;
        this.order.driverAddFee=res.driverAddFee;
        this.order.driverCarSizeRealName=res.driverCarSizeRealName;
        this.order.driverCarTypeRealName=res.driverCarTypeRealName;
        this.order.driverCarBrandRealName=res.driverCarBrandRealName;
        this.order.driverCarWeightRealName=res.driverCarWeightRealName;
        this.order.routerSource=res.routerSource;
        this.order.routerDestination=res.routerDestination;
      }
    })
    .catch(err => {
        console.log(err);
    });
    },

  }


};
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
    & li {
      padding: 5px 15px;
    }
  }
}
</style>
