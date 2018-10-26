<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem" size="large" >
        <el-form-item label="大客户名字" style="width:296px">
          <el-autocomplete v-model="customerName"
                           placeholder="大客户名字"
                           clearable
                           :fetch-suggestions="querySearchAsync"
                           @select="handleSelect"
                           style="width:200px">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="线路别名" style="width:300px">
          <el-autocomplete v-model="routerAlial"
                           placeholder="线路别名"
                           clearable
                           :fetch-suggestions="querySearchAsyncRouter"
                           @select="handleSelectRouter"
                           style="width:200px">
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="是否需要搬卸" style="width:400px">
          <el-select v-model="createOrder.wetherTakeover">
            <el-option
              v-for="item in takeOver"
              :key="item.text"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货人名字" >
          <el-input v-model="createOrder.sendGoodsPersonName" placeholder="发货人名字" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="发货人电话">
          <el-input v-model="createOrder.sendGoodsPersonMobile" placeholder="发货人电话" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="发货人地址" style="width:500px">
          <el-input v-model="createOrder.sendAddressDetail" placeholder="发货人地址" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="发货地(省/市/区/县/)" style="width:500px">
          <el-input size="large" v-model="sourceLocalction"  disabled style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="收货人名字" >
          <el-input v-model="createOrder.receiveGoodsPersonName" placeholder="收货人名字"  style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话">
          <el-input v-model="createOrder.receiveGoodsPersonMobile" placeholder="收货人电话" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="收货人地址" style="width:500px">
          <el-input v-model="createOrder.receiveAddressDetail" placeholder="收货人地址" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="收货地(省/市/区/县/)" style="width:500px">
          <el-input v-model="destinationLocalction" disabled style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="车型和车长" style="width:285px">
          <el-select v-model="carTypeAndSize" placeholder="请选择车型和车长" style="width:200px">
            <el-option
              v-for="item in carAndPriceModels"
              :key="item.typeName"
              :label="item.typeName"
              :value="item.typeName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="路径站点个数" style="width:300px">
          <el-input v-model="createOrder.sendGoodsLocationNum" placeholder="路径站点个数" style="width:195px"></el-input>
        </el-form-item>
        <el-form-item label="约车时间" style="width:1200px">
          <el-date-picker
            size="large"
            v-model="createOrder.appointmentDate"
            type="datetime"
            placeholder="请选择约车时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="补充信息" style="width:500px">
          <el-input  type="textarea" style="width:500px" v-model="createOrder.remark" :rows="7" placeholder="补充信息"></el-input>
        </el-form-item>
        <el-form-item label="货物信息" style="width:500px">
          <el-input type="textarea" style="width:500px" v-model="createOrder.goodsRemark" :rows="7" placeholder="货物信息" ></el-input>
        </el-form-item>
        <el-form-item style="width:1700px">
          <el-button type="primary" @click="_createOrderByWeb"   :loading="searching">确认下单</el-button>
          <el-button type="primary" @click="cancelSign()"   >重置</el-button>
        </el-form-item>
      </el-form>
    </template>
  </d2-container>
</template>

<script>
import {
  getMasterCustomerListBySearchKey,
  getAllRouterAlia,
  getCustomerRouterDetail,
  getPriceAndCarByCustomerIdAndRouterSeries,
  createOrderByWeb
} from "@/api/createorder";

import Cookies from "js-cookie";
export default {
  data() {
    return {
      searching:false,
      value5: "",
      customerNumId: Cookies.get("__user__customernumid"),
      franchiseeId: "",
      currentPage: 1,
      pageSize: 200,
      searchItem: {
        saleId: "",
        contactNameSearchKey: "",
        customerNameSearchKey: "",
        mobilePhoneSearchKey: "",
        registerEndTime: "",
        registerStartTime: "",
        registerTime: ""
      },
      takeOver : [
        {text:'是',value:'Y'},
        {text:'否',value:'N'}
      ],
      carAndPriceModels: [],
      carTypeAndSize:"",
      priceAndInstance:"",
      overPrice:"",
      carAndPriceModel:{
        carTypeName:"",
        carSizeName:"",
        typeName:"",
        initPrice:"",
        initDistance:"",
        overstepPrice:"",
      },
      customerName:"",
      routerAlial:"",
      sourceLocalction: "",
      destinationLocalction: "",
      createOrder: {
        carTypeSeries:"",
        carSizeSeries:"",
        customerNumId: Cookies.get("__user__customernumid"),
        customerMasterId: "",
        wetherSpecialCustomerPrice: "",
        routerDetailSeries: "",
        routerPriceSeries: "",
        sendGoodsPersonName: "",
        sendGoodsPersonMobile: "",
        sendGoodsLocationNum: "",
        appointmentNum:"",
        deliverGoodsTime: "",
        receiveGoodsPersonName: "",
        receiveGoodsPersonMobile: "",
        receiveGoodsLocationNum: "",
        sendAddressDetail: "",
        receiveAddressDetail: "",
        wetherTakeover: "N",
        remark: "",
        appointmentDate: "",
        initPrice: "",
        initDistance: "",
        overstepPrice: "",
        goodsRemark: "",
      },
      masterCustomerSearchKey: {
        customerMasterSearchKey: "",
        customerNumId: "",
      },
      tableData: [],
      customerSales: [],
      customerMaster: [],
      routerDetails: [],
      customerDetail: {},
    };
  },

  created() {
    this._getMasterCustomerListBySearchKey({
      customerNumId: this.customerNumId,
    });
  },
  watch: {
    "createOrder.customerMasterId"() {
      this._getAllRouterAlia({
        customerNumId: this.customerNumId,
        customerMasterId: this.createOrder.customerMasterId
      });
    },
    "createOrder.routerDetailSeries"() {
      this._getCustomerRouterDetail({
        customerNumId: this.customerNumId,
        routerDetailSeries: this.createOrder.routerDetailSeries
     });

      this._getPriceAndCarByCustomerIdAndRouterSeries({
        customerNumId: this.customerNumId,
        routerDetailSeries: this.createOrder.routerDetailSeries,
        customerMasterId: this.createOrder.customerMasterId,
        wetherSpecialCustomerPrice: this.createOrder.wetherSpecialCustomerPrice
      });
    },

    "carTypeAndSize"() {
      for (var i=0;i<this.carAndPriceModels.length;i++)
      {
        if(this.carAndPriceModels[i].typeName==this.carTypeAndSize){
          this.createOrder.carTypeSeries=this.carAndPriceModels[i].carTypeName;
          this.createOrder.carSizeSeries=this.carAndPriceModels[i].carSizeName;
          this.createOrder.initPrice=this.carAndPriceModels[i].initPrice;
          this.createOrder.initDistance=this.carAndPriceModels[i].initDistance;
          this.createOrder.overstepPrice=this.carAndPriceModels[i].overstepPrice;
          this.createOrder.routerPriceSeries=this.carAndPriceModels[i].routerPriceId;
          this.priceAndInstance=this.carAndPriceModels[i].initPrice+'元/'+this.carAndPriceModels[i].initDistance+'公里';
          this.overPrice=this.carAndPriceModels[i].overstepPrice+'元/公里';
        }
      }


    }

  },
  methods: {
    querySearchAsync(qs, cb) {
      this.masterCustomerSearchKey.customerMasterSearchKey=qs;
      this.masterCustomerSearchKey.customerNumId=this.customerNumId;
      getMasterCustomerListBySearchKey(this.masterCustomerSearchKey)
        .then(res => {
        if (res.code === 0) {
        let customerMasters = [];
        // customerMasters= res.customerMasterList;
        res.customerMasterList.forEach(item => {
          customerMasters.push({
          value: item.customerName,
          ...item
      });
      });
        this.customerMaster = customerMasters;
        let customerMaster = this.customerMaster;
        var results = qs
          ? customerMaster.filter(this.createStateFilter(qs))
          : customerMaster;
        cb(results);
      }
    })
    },
    createStateFilter(qs) {
      return state => {
        return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
      };
    },
    handleSelect(item) {
      this.createOrder.customerMasterId=item.customerMasterId;
    },
    querySearchAsyncRouter(qs, cb) {
      let routerDetails = this.routerDetails;
      var results = qs
        ? routerDetails.filter(this.createStateFilterRouter(qs))
        : routerDetails;
      cb(results);
    },
    createStateFilterRouter(qs) {
      return state => {
        return state.value.toLowerCase().indexOf(qs.toLowerCase()) != -1;
      };
    },
    handleSelectRouter(item) {
      this.createOrder.routerDetailSeries=item.series;
    },

    _getAllRouterAlia(item) {
      getAllRouterAlia(item)
        .then(res => {
        if (res.code === 0) {
        let routerDetails = [];
        res.routerAliaModels.forEach(item => {
          routerDetails.push({
          value: item.routerAlia,
          ...item
      });
      });
        this.routerDetails = routerDetails;
        this.createOrder.wetherSpecialCustomerPrice = res.weatherSpecialCustomer;
      }
    })
    .catch(err => {
        console.log(err);
    });
    },

    _getMasterCustomerListBySearchKey(params) {
      getMasterCustomerListBySearchKey(params)
        .then(res => {
        if (res.code === 0) {
        let customerMasters = [];
        // customerMasters= res.customerMasterList;
        res.customerMasterList.forEach(item => {
          customerMasters.push({
          value: item.customerName,
          ...item
      });
      });
        this.customerMaster = customerMasters;
      }
    })
    .catch(err => {
        console.log(err);
    });
    },
    _getCustomerRouterDetail(params) {
      getCustomerRouterDetail(params)
        .then(res => {
        if (res.code === 0) {
        this.createOrder.sendGoodsPersonName=res.sendGoodsPersonName;
        this.createOrder.sendGoodsPersonMobile=res.sendGoodsPersonMobile;
        this.createOrder.sendAddressDetail=res.sendAddressDetail;
        this.createOrder.receiveGoodsPersonName=res.receiveGoodsPersonName;
        this.createOrder.receiveGoodsPersonMobile=res.receiveGoodsPersonMobile;
        this.createOrder.receiveAddressDetail=res.receiveAddressDetail;
        this.createOrder.sendGoodsLocationNum=res.sendGoodsLocationNum;
        this.createOrder.sendGoodsLocationNum=res.sendGoodsLocationNum;
        this.sourceLocalction=res.sourcePrvName+"/"+res.sourceCityName+"/"+res.sourceCityAreaName+"/"+res.sourceTownName;
        this.destinationLocalction=res.destinationPrvName+"/"+res.destinationCityName+"/"+res.destinationCityAreaName+"/"+res.destinationTownName;
      }
    })
    .catch(err => {
        console.log(err);
    });
    },

    _getPriceAndCarByCustomerIdAndRouterSeries(params) {
      getPriceAndCarByCustomerIdAndRouterSeries(params)
        .then(res => {
        if (res.code === 0) {
        this.carAndPriceModels=res.carAndPriceModels;
      }
    })
    .catch(err => {
        console.log(err);
    });
    },

    _createOrderByWeb(){
      this.searching=true;
      if (this.createOrder.customerMasterId === "") {
        this.$message({
          type: "error",
          message: "大客户名字不可以为空！"
        });
        this.searching=false;
        return;
      }
      if (this.createOrder.routerDetailSeries === "") {
        this.$message({
          type: "error",
          message: "线路不可以为空！"
        });
        this.searching=false;
        return;
      }
      if (this.createOrder.carSizeSeries === "") {
        this.$message({
          type: "error",
          message: "车型车长不可以为空！"
        });
        this.searching=false;
        return;
      }
      if (this.createOrder.appointmentDate === "") {
        this.$message({
          type: "error",
          message: "约车时间不可以为空！"
        });
        this.searching=false;
        return;
      }
      if (this.createOrder.initPrice === "") {
        this.$message({
          type: "error",
          message: "订单报价不可以为空！请去维护"
        });
        this.searching=false;
        return;
      }
      if (this.createOrder.sendGoodsPersonName === "") {
        this.$message({
          type: "error",
          message: "发货人名字不可以为空！"
        });
        this.searching=false;
        return;
      }
      if (this.createOrder.sendGoodsPersonMobile === "") {
        this.$message({
          type: "error",
          message: "发货人手机不可以为空！"
        });
        this.searching=false;
        return;
      }
      if (this.createOrder.sendAddressDetail === "") {
        this.$message({
          type: "error",
          message: "发货人地址不可以为空！"
        });
        this.searching=false;
        return;
      }
      if (this.createOrder.receiveGoodsPersonName === "") {
        this.$message({
          type: "error",
          message: "收货人名字不可以为空！"
        });
        this.searching=false;
        return;
      }
      if (this.createOrder.receiveGoodsPersonMobile === "") {
        this.$message({
          type: "error",
          message: "收货人手机不可以为空！"
        });
        this.searching=false;
        return;
      }
      if (this.createOrder.receiveAddressDetail === "") {
        this.$message({
          type: "error",
          message: "收货人地址不可以为空！"
        });
        this.searching=false;
        return;
      }
      this.$confirm("是否确定下单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      createOrderByWeb(this.createOrder)
        .then(res => {
        if (res.code === 0) {
        this.$message.success("创建手工单成功！");
        cancelSign();
      }
    }).catch(err => {
        console.log(err);
    });
    })
      this.searching=false;
    },

    cancelSign(){
      this.$confirm("是否清除此页下单数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
      location.reload();
    })
    }
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
