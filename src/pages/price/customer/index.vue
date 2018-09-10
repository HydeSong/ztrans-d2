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
          <el-input v-model="searchItem.routerNumberSearchKey" placeholder="线路编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-autocomplete v-model="searchItem.routerDetailAliaSearchKey"
                           placeholder="线路别名"
                           clearable
                           :fetch-suggestions="queryRouterDetailAlia"
                           @select="onRouterDetailAliaSelect">
            <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>
          </el-autocomplete>
          <el-autocomplete
            v-model="state4"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
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
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.routerPriceList"
              highlight-current-row
              style="width: 100%">
              <el-table-column
                prop="carTypeRealName"
                label="车型">
              </el-table-column>
              <el-table-column
                prop="carSizeRealName"
                label="车长">
              </el-table-column>
              <el-table-column
                prop="routerCustomerType"
                label="报价类型"
                :formatter="routerCustomerTypeFormat">
              </el-table-column>
              <el-table-column
                prop="initPrice"
                label="起步价格(元)">
              </el-table-column>
              <el-table-column
                prop="overstepPrice"
                label="超出价格(元/公里)">
              </el-table-column>
              <el-table-column
                prop="saleProportion"
                label="销售比例">
              </el-table-column>
              <el-table-column
                prop="franchiseeProportion"
                label="加盟商比例">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="onDeleteDetailPrice(scope.$index, scope.row)" v-if="scope.$index % 2 === 1">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
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
            <el-button @click="onEditCustomerPrice(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
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
      <el-dialog title="新增客户报价" :visible.sync="addDialog">
        <div class="block" style="text-align: left">
          线路设置
        </div>
        <div class="block" style="text-align: left; padding: 0 15px">
          <el-form :inline="true" :model="addItem">
            <el-form-item label="客户">
              <el-select v-model="addItem.customerSeries" placeholder="请选择" clearable>
                <el-option v-for="(item, index) in customerMasterList" :key="index" :label="item.customerName" :value="item.customerMasterId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="线路编号">
              <el-input v-model="addItem.routerNumber" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="线路别名">
              <el-input v-model="addItem.routerAlia" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="发货人名字">
              <el-input v-model="addItem.sendGoodsPersonName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="发货人电话">
              <el-input v-model="addItem.sendGoodsPersonMobile" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="发件人详细地址">
              <el-input v-model="addItem.sendAddressDetail" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="收货人名字">
              <el-input v-model="addItem.receiveGoodsPersonName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="收货人电话">
              <el-input v-model="addItem.receiveGoodsPersonMobile" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="收件人详细地址">
              <el-input v-model="addItem.receiveAddressDetail" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="经停站点">
              <el-select
                v-model="addItem.routerStations"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请输入经停站点">
              </el-select>
            </el-form-item>
            <el-form-item label="起始点">
              <el-select v-model="addItem.sourcePrv" placeholder="请选择省">
                <el-option
                  v-for="item in allPrv"
                  :key="item.prvId"
                  :label="item.prvName"
                  :value="item.prvId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.sourceCity" placeholder="请选择市">
                <el-option
                  v-for="item in allCity"
                  :key="item.cityId"
                  :label="item.cityName"
                  :value="item.cityId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.sourceCityArea" placeholder="请选择区">
                <el-option
                  v-for="item in allCityArea"
                  :key="item.cityAreaId"
                  :label="item.cityAreaName"
                  :value="item.cityAreaId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.sourceTown" placeholder="请选择镇">
                <el-option
                  v-for="item in allTown"
                  :key="item.townId"
                  :label="item.townName"
                  :value="item.townId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目的地">
              <el-select v-model="addItem.destinationPrv" placeholder="请选择省" >
                <el-option
                  v-for="item in allPrv"
                  :key="item.prvId"
                  :label="item.prvName"
                  :value="item.prvId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.destinationCity" placeholder="请选择市">
                <el-option
                  v-for="item in allCity"
                  :key="item.cityId"
                  :label="item.cityName"
                  :value="item.cityId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.destinationCityArea" placeholder="请选择区">
                <el-option
                  v-for="item in allCityArea"
                  :key="item.cityAreaId"
                  :label="item.cityAreaName"
                  :value="item.cityAreaId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.destinationTown" placeholder="请选择镇">
                <el-option
                  v-for="item in allTown"
                  :key="item.townId"
                  :label="item.townName"
                  :value="item.townId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="线路备注">
              <el-input type="textarea" :rows="4" v-model="addItem.remark" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="block" style="text-align: left">
          报价设置
          <el-table
            :data="priceSetAddList"
            highlight-current-row
            style="width: 100%">
            <el-table-column
              prop="carTypeRealName"
              label="车型"
              width="120">
            </el-table-column>
            <el-table-column
              prop="carSizeRealName"
              label="车长"
              width="120">
            </el-table-column>
            <el-table-column
              prop="routerCustomerType"
              label="报价类型"
              :formatter="routerCustomerTypeFormat">
            </el-table-column>
            <el-table-column
              prop="initDistance"
              label="起步距离(公里)"
              width="160">
            </el-table-column>
            <el-table-column
              prop="initPrice"
              label="起步价格(元)"
              width="160">
            </el-table-column>
            <el-table-column
              prop="overstepPrice"
              label="超出价格(元/公里)"
              width="160">
            </el-table-column>
            <el-table-column
              prop="saleProportion"
              label="销售比例">
            </el-table-column>
            <el-table-column
              prop="franchiseeProportion"
              label="加盟商比例">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="onEditPrice(scope.$index, scope.row)" v-if="scope.$index % 2 === 1">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="onAddPrice">新增报价</el-button>
          <el-button type="primary" @click="onAddConfirm">提 交</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="新增报价"
        :visible.sync="innerAddVisible"
        append-to-body>
        <el-form :inline="true">
          <el-form-item label="车型">
            <el-select v-model="carTypeName" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="`${item.typeId}-${item.typeName}`"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车长">
            <el-select v-model="carSizeName" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="`${item.sizeId}-${item.sizeName}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="block" style="padding: 15px 0">
          客户报价
        </div>
        <div class="block" style="padding: 0 15px">
          <el-form :inline="true" :model="priceSetAddItem0">
            <el-form-item label="起步距离(公里)">
              <el-input v-model="priceSetAddItem0.initDistance" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="起步价格(元)">
              <el-input v-model="priceSetAddItem0.initPrice" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="超出价格(元/公里)">
              <el-input v-model="priceSetAddItem0.overstepPrice" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="销售比例">
              <el-input v-model="priceSetAddItem0.saleProportion" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="加盟商比例">
              <el-input v-model="priceSetAddItem0.franchiseeProportion" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="block" style="padding: 15px 0">
          司机报价
        </div>
        <div class="block" style="padding: 0 15px">
          <el-form :inline="true" :model="priceSetAddItem1">
            <el-form-item label="起步距离(公里)">
              <el-input v-model="priceSetAddItem1.initDistance" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="起步价格(元)">
              <el-input v-model="priceSetAddItem1.initPrice" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="超出价格(元/公里)">
              <el-input v-model="priceSetAddItem1.overstepPrice" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="销售比例">
              <el-input v-model="priceSetAddItem1.saleProportion" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="加盟商比例">
              <el-input v-model="priceSetAddItem1.franchiseeProportion" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerAddVisible = false">取 消</el-button>
          <el-button type="primary" @click="onAddPriceConfirm">提 交</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="编辑报价"
        :visible.sync="innerEditVisible"
        append-to-body>
        <el-form :inline="true">
          <el-form-item label="车型">
            <el-select v-model="carTypeName" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="`${item.typeId}-${item.typeName}`"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车长">
            <el-select v-model="carSizeName" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="`${item.sizeId}-${item.sizeName}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="block" style="padding: 15px 0">
          客户报价
        </div>
        <div class="block" style="padding: 0 15px">
          <el-form :inline="true" :model="priceSetAddItem0">
            <el-form-item label="起步距离(公里)">
              <el-input v-model="priceSetAddItem0.initDistance" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="起步价格(元)">
              <el-input v-model="priceSetAddItem0.initPrice" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="超出价格(元/公里)">
              <el-input v-model="priceSetAddItem0.overstepPrice" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="销售比例">
              <el-input v-model="priceSetAddItem0.saleProportion" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="加盟商比例">
              <el-input v-model="priceSetAddItem0.franchiseeProportion" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="block" style="padding: 15px 0">
          司机报价
        </div>
        <div class="block" style="padding: 0 15px">
          <el-form :inline="true" :model="priceSetAddItem1">
            <el-form-item label="起步距离(公里)">
              <el-input v-model="priceSetAddItem1.initDistance" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="起步价格(元)">
              <el-input v-model="priceSetAddItem1.initPrice" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="超出价格(元/公里)">
              <el-input v-model="priceSetAddItem1.overstepPrice" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="销售比例">
              <el-input v-model="priceSetAddItem1.saleProportion" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="加盟商比例">
              <el-input v-model="priceSetAddItem1.franchiseeProportion" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="onEditPriceConfirm(editPriceIndex)">提 交</el-button>
        </span>
      </el-dialog>
      <el-dialog title="编辑客户报价" :visible.sync="editDialog">
        <div class="block" style="text-align: left">
          线路设置
        </div>
        <div class="block" style="text-align: left; padding: 0 15px">
          <el-form :inline="true" :model="addItem">
            <el-form-item label="客户">
              <el-select v-model="addItem.customerSeries" placeholder="请选择" clearable>
                <el-option v-for="(item, index) in customerMasterList" :key="index" :label="item.customerName" :value="item.customerMasterId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="线路编号">
              <el-input v-model="addItem.routerNumber" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="线路别名">
              <el-input v-model="addItem.routerAlia" placeholder="请输入" disabled></el-input>
            </el-form-item>
            <el-form-item label="发货人名字">
              <el-input v-model="addItem.sendGoodsPersonName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="发货人电话">
              <el-input v-model="addItem.sendGoodsPersonMobile" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="发件人详细地址">
              <el-input v-model="addItem.sendAddressDetail" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="收货人名字">
              <el-input v-model="addItem.receiveGoodsPersonName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="收货人电话">
              <el-input v-model="addItem.receiveGoodsPersonMobile" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="收件人详细地址">
              <el-input v-model="addItem.receiveAddressDetail" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="经停站点">
              <el-select
                v-model="addItem.routerStations"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请输入经停站点">
              </el-select>
            </el-form-item>
            <el-form-item label="起始点">
              <el-select v-model="addItem.sourcePrv" placeholder="请选择省">
                <el-option
                  v-for="item in allPrv"
                  :key="item.prvId"
                  :label="item.prvName"
                  :value="item.prvId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.sourceCity" placeholder="请选择市">
                <el-option
                  v-for="item in allCity"
                  :key="item.cityId"
                  :label="item.cityName"
                  :value="item.cityId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.sourceCityArea" placeholder="请选择区">
                <el-option
                  v-for="item in allCityArea"
                  :key="item.cityAreaId"
                  :label="item.cityAreaName"
                  :value="item.cityAreaId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.sourceTown" placeholder="请选择镇">
                <el-option
                  v-for="item in allTown"
                  :key="item.townId"
                  :label="item.townName"
                  :value="item.townId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="目的地">
              <el-select v-model="addItem.destinationPrv" placeholder="请选择省">
                <el-option
                  v-for="item in allPrv"
                  :key="item.prvId"
                  :label="item.prvName"
                  :value="item.prvId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.destinationCity" placeholder="请选择市">
                <el-option
                  v-for="item in allCity"
                  :key="item.cityId"
                  :label="item.cityName"
                  :value="item.cityId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.destinationCityArea" placeholder="请选择区">
                <el-option
                  v-for="item in allCityArea"
                  :key="item.cityAreaId"
                  :label="item.cityAreaName"
                  :value="item.cityAreaId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.destinationTown" placeholder="请选择镇">
                <el-option
                  v-for="item in allTown"
                  :key="item.townId"
                  :label="item.townName"
                  :value="item.townId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="线路备注">
              <el-input type="textarea" :rows="4" v-model="addItem.remark" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="block" style="text-align: left">
          报价设置
          <el-table
            :data="priceSetAddList"
            highlight-current-row
            style="width: 100%">
            <el-table-column
              prop="carTypeRealName"
              label="车型"
              width="120">
            </el-table-column>
            <el-table-column
              prop="carSizeRealName"
              label="车长"
              width="120">
            </el-table-column>
            <el-table-column
              prop="routerCustomerType"
              label="报价类型"
              :formatter="routerCustomerTypeFormat">
            </el-table-column>
            <el-table-column
              prop="initDistance"
              label="起步距离(公里)"
              width="160">
            </el-table-column>
            <el-table-column
              prop="initPrice"
              label="起步价格(元)"
              width="160">
            </el-table-column>
            <el-table-column
              prop="overstepPrice"
              label="超出价格(元/公里)"
              width="160">
            </el-table-column>
            <el-table-column
              prop="saleProportion"
              label="销售比例">
            </el-table-column>
            <el-table-column
              prop="franchiseeProportion"
              label="加盟商比例">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="onEditPrice(scope.$index, scope.row)" v-if="scope.$index % 2 === 1">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="onAddPrice">新增报价</el-button>
          <el-button type="primary" @click="onEditConfirm">提 交</el-button>
        </span>
      </el-dialog>
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaSearchList } from '@/api/schedule'
  import { getCarTypeList } from '@/api/order'
  import { getAllRouterCustomerPrice, getMasterCustomerList, addRouterCustomerPrice, deleteRouterByRouterId, deleteRouterCustomerPrice, updateBatchRouterPrice, updateRouterCustomerPrice, getConsumerRouterPriceByRouterId } from '@/api/price'
  import { getAllPrv, getAllCity, getAllCityArea, getAllTown, getCarSizeList } from '@/api/dictionary'
  import Cookies from 'js-cookie'
  export default {
    data () {
      return {
        restaurants: [],
        state4: '',
        timeout:  null,
        customerNumId: Cookies.get('__user__customernumid'),
        currentPage: 1,
        pageSize: 200,
        curPage: 1,
        pgSize: 100,
        routerDetail: [],
        searchItem: {
          carSizeNameAliaSearchKey: '',
          customerSeries: '',
          routerDetailAliaSearchKey: '',
          routerDetailSeries: '',
          routerNumberSearchKey: '',
          routerType: 0
        },
        addItem: {
          children: [],
          customerNumId: '',
          customerSeries: '',
          destinationCity: '',
          destinationCityArea: '',
          destinationPrv: '',
          destinationTown: '',
          remark: '',
          routerAlia: '',
          routerNumber: '',
          routerType: 0,
          sourceCity: '',
          sourceCityArea: '',
          sourcePrv: '',
          sourceTown: '',
          sendGoodsPersonName: '',
          sendGoodsPersonMobile: '',
          sendAddressDetail: '',
          receiveGoodsPersonName: '',
          receiveGoodsPersonMobile: '',
          receiveAddressDetail: '',
          routerStations: []
        },
        priceSetAddList: [],
        priceSetAddItem0: {
          carTypeName: '',
          carTypeRealName: '',
          carSizeName: '',
          carSizeRealName: '',
          franchiseeProportion: '',
          initDistance: '',
          initPrice: '',
          overstepPrice: '',
          routerCustomerType: 0,
          routerPriceId: '',
          routerType: 0,
          saleProportion: ''
        },
        priceSetAddItem1: {
          carTypeName: '',
          carTypeRealName: '',
          carSizeName: '',
          carSizeRealName: '',
          franchiseeProportion: '',
          initDistance: '',
          initPrice: '',
          overstepPrice: '',
          routerCustomerType: 1,
          routerPriceId: '',
          routerType: 0,
          saleProportion: ''
        },
        tableData: [],
        searching: false,
        addDialog: false,
        editDialog: false,
        innerAddVisible: false,
        innerEditVisible: false,
        customerMasterList: [],
        allPrv: [],
        allCity: [],
        allCityArea: [],
        allTown: [],
        carTypes: [],
        carSizes: [],
        carTypeName: '',
        carSizeName: '',
        editPriceIndex: ''
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
    mounted() {
      this.restaurants = this.loadAll();
    },
    created () {
      this._getMasterCustomerList({
        customerNumId: this.customerNumId,
        saleId: ''
      })
      this._getRouterAliaSearchList({
        customerNumId: this.customerNumId,
        customerSeries: '',
        routerSearchKey: ''
      })
      this.onSearch()
    },
    watch: {
      'addItem.sourcePrv' () {
        // this.addItem.sourceCity = ''
        // this.addItem.sourceCityArea = ''
        // this.addItem.sourceTown = ''
        this._getAllCity({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.addItem.sourcePrv
        })
      },
      'addItem.destinationPrv' () {
        // this.addItem.destinationCity = ''
        // this.addItem.destinationCityArea = ''
        // this.addItem.destinationTown = ''
        this._getAllCity({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.addItem.destinationPrv
        })
      },
      'addItem.sourceCity' () {
        // this.addItem.sourceCityArea = ''
        // this.addItem.sourceTown = ''
        this._getAllCityArea({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.addItem.sourcePrv,
          cityId: this.addItem.sourceCity
        })
      },
      'addItem.destinationCity' () {
        // this.addItem.destinationCityArea = ''
        // this.addItem.destinationTown = ''
        this._getAllCityArea({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.addItem.destinationPrv,
          cityId: this.addItem.destinationCity
        })
      },
      'addItem.sourceCityArea' () {
        // this.addItem.sourceTown = ''
        this._getAllTown({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          cityAreaId: this.addItem.sourceCityArea
        })
      },
      'addItem.destinationCityArea' () {
        // this.addItem.destinationTown = ''
        this._getAllTown({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          cityAreaId: this.addItem.destinationCityArea
        })
      }
    },
    methods: {
      loadAll() {
        return [
          { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
          { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
          { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
          { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
          { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
          { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
          { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
          { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
          { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
          { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
          { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
          { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
          { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
          { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
          { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
          { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
          { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
          { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
          { "value": "枪会山", "address": "上海市普陀区棕榈路" },
          { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
          { "value": "钱记", "address": "上海市长宁区天山西路" },
          { "value": "壹杯加", "address": "上海市长宁区通协路" },
          { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
          { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
          { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
          { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
          { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
          { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
          { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
          { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
          { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
          { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
          { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
          { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
          { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
          { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
          { "value": "浏阳蒸菜", "address": "天山西路430号" },
          { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
          { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
          { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
          { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
          { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
          { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
          { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
          { "value": "阳阳麻辣烫", "address": "天山西路389号" },
          { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
        ];
      },
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
      },
      _getRouterAliaSearchList (params) {
        getRouterAliaSearchList(params).then(res => {
          if (res.code === 0) {
            this.routerDetail = res.routerDetailAliaModel
          }
        }).catch(err => {
          console.log(err)
        })
      },
      createStateFilter(qs) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(qs.toLowerCase()) === 0);
        }
      },
      queryRouterDetailAlia (qs, cb) {
        let routerDetail = this.routerDetail
        var results = qs ? routerDetail.filter(this.createStateFilter(qs)) : routerDetail
        console.log(results)
        getRouterAliaSearchList({
          customerNumId: this.customerNumId,
          customerSeries: this.searchItem.customerSeries,
          routerSearchKey: qs
        }).then(res => {
          if (res.code === 0) {
            this.routerDetail = res.routerDetailAliaModel
            cb(this.routerDetail)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      onRouterDetailAliaSelect (item) {
        console.log(item)
      },
      routerCustomerTypeFormat (val) {
        return val.routerCustomerType === 0 ? '客户报价' : '司机报价'
      },
      _getCarSizeList (params) {
        getCarSizeList(params).then(res => {
          if (res.code === 0) {
            this.carSizes = res.carSizes
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
      _getAllPrv (params) {
        getAllPrv(params).then(res => {
          if (res.code === 0) {
            this.allPrv = res.prvNameAndPrvIds
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllCity (params) {
        getAllCity(params).then(res => {
          if (res.code === 0) {
            this.allCity = res.cityeNameAndCityeIds
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllCityArea (params) {
        getAllCityArea(params).then(res => {
          if (res.code === 0) {
            this.allCityArea = res.cityAreaNameAndCityAreaIdModel
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllTown (params) {
        getAllTown(params).then(res => {
          if (res.code === 0) {
            this.allTown = res.townNameAndTownIdModel
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getConsumerRouterPriceByRouterId (params) {
        // console.log(params)
        getConsumerRouterPriceByRouterId(params).then(res => {
          if (res.code === 0) {
            // console.log(res)
            this.addItem.children = []
            this.addItem.customerNumId = this.customerNumId
            this.addItem.customerSeries = res.allRouterPriceGetModel.customerSeries
            this.addItem.destinationCity = res.allRouterPriceGetModel.destinationCity
            this.addItem.destinationCityArea = res.allRouterPriceGetModel.destinationCityArea
            this.addItem.destinationPrv = res.allRouterPriceGetModel.destinationPrv
            this.addItem.destinationTown = res.allRouterPriceGetModel.destinationTown
            this.addItem.remark = res.allRouterPriceGetModel.remark
            this.addItem.routerAlia = res.allRouterPriceGetModel.routerAlia
            this.addItem.routerDetailSeries = res.allRouterPriceGetModel.routerDetailSeries
            this.addItem.routerNumber = res.allRouterPriceGetModel.routerNumber
            this.addItem.sourceCity = res.allRouterPriceGetModel.sourceCity
            this.addItem.sourceCityArea = res.allRouterPriceGetModel.sourceCityArea
            this.addItem.sourcePrv = res.allRouterPriceGetModel.sourcePrv
            this.addItem.sourceTown = res.allRouterPriceGetModel.sourceTown
            this.priceSetAddList = res.allRouterPriceGetModel.routerPriceList
            this.addItem.sendGoodsPersonName = res.allRouterPriceGetModel.sendGoodsPersonName
            this.addItem.sendGoodsPersonMobile = res.allRouterPriceGetModel.sendGoodsPersonMobile
            this.addItem.sendAddressDetail = res.allRouterPriceGetModel.sendAddressDetail
            this.addItem.receiveGoodsPersonName = res.allRouterPriceGetModel.receiveGoodsPersonName
            this.addItem.receiveGoodsPersonMobile = res.allRouterPriceGetModel.receiveGoodsPersonMobile
            this.addItem.receiveAddressDetail = res.allRouterPriceGetModel.receiveAddressDetail
            this.addItem.routerStations = res.allRouterPriceGetModel.routerStations
            res.allRouterPriceGetModel.routerPriceList.forEach((item) => {
              this.addItem.children.push({
                carTypeName: item.carTypeName,
                carSizeName: item.carSizeName,
                routerType: item.routerType,
                routerPriceList: [item]
              })
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _addRouterCustomerPrice (params) {
        if (params.customerSeries === '') {
          this.$message({
            type: 'error',
            message: '大客户不可以为空！'
          })
          return
        }
        if (params.routerAlia === '') {
          this.$message({
            type: 'error',
            message: '线路别名不可以为空！'
          })
          return
        }
        if (params.routerNumber === '') {
          this.$message({
            type: 'error',
            message: '线路编号不可以为空！'
          })
          return
        }
        if (params.sourcePrv === '') {
          this.$message({
            type: 'error',
            message: '起始省不可以为空！'
          })
          return
        }
        if (params.sourceCity === '') {
          this.$message({
            type: 'error',
            message: '起始市不可以为空！'
          })
          return
        }
        if (params.sourceCityArea === '') {
          this.$message({
            type: 'error',
            message: '起始区不可以为空！'
          })
          return
        }
        if (params.sourceTown === '') {
          this.$message({
            type: 'error',
            message: '起始镇不可以为空！'
          })
          return
        }
        if (params.destinationPrv === '') {
          this.$message({
            type: 'error',
            message: '目的省不可以为空！'
          })
          return
        }
        if (params.destinationCity === '') {
          this.$message({
            type: 'error',
            message: '目的市不可以为空！'
          })
          return
        }
        if (params.destinationCityArea === '') {
          this.$message({
            type: 'error',
            message: '目的区不可以为空！'
          })
          return
        }
        if (params.destinationTown === '') {
          this.$message({
            type: 'error',
            message: '目的镇不可以为空！'
          })
          return
        }
        var x
        for (x in params.children) {
          if (params.children[x].carTypeName === '') {
            this.$message({
              type: 'error',
              message: '车型不可以为空！'
            })
            return
          }
          if (params.children[x].carSizeName === '') {
            this.$message({
              type: 'error',
              message: '尺寸不可以为空！'
            })
            return
          }
          var y
          for (y in params.children[x].routerPriceList) {
            if (params.children[x].routerPriceList[y].initPrice === '') {
              this.$message({
                type: 'error',
                message: '起步价不可以为空！'
              })
              return
            }
            if (params.children[x].routerPriceList[y].initDistance === '') {
              this.$message({
                type: 'error',
                message: '起步距离如果不清楚请写0！'
              })
              return
            }
            if (params.children[x].routerPriceList[y].overstepPrice === '') {
              this.$message({
                type: 'error',
                message: '超过指定范围价如果不清楚请写0！'
              })
              return
            }
            if (params.children[x].routerPriceList[y].franchiseeProportion === '') {
              this.$message({
                type: 'error',
                message: '加盟商提成比例如果不清楚请写0！'
              })
              return
            }
            if (params.children[x].routerPriceList[y].saleProportion === '') {
              this.$message({
                type: 'error',
                message: '销售提成比例如果不清楚请写0！'
              })
              return
            }
          }
        }
        addRouterCustomerPrice(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.addDialog = false
            this.onSearch()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _deleteRouterByRouterId (params, index) {
        deleteRouterByRouterId(params).then(res => {
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
      _deleteRouterCustomerPrice (params, index) {
        deleteRouterCustomerPrice(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.onSearch()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _updateBatchRouterPrice (params) {
        updateBatchRouterPrice(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.editDialog = false
            this.onSearch()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _updateRouterCustomerPrice (params) {
        // console.log(params)
        updateRouterCustomerPrice(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.editDialog = false
            this.onSearch()
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
      onSearch () {
        this._getAllRouterCustomerPrice({
          current: this.currentPage,
          pageSize: this.pageSize,
          customerNumId: this.customerNumId,
          carSizeNameAli_getAllTownaSearchKey: this.searchItem.carSizeNameAliaSearchKey,
          customerSeries: this.searchItem.customerSeries,
          routerDetailAliaSearchKey: this.searchItem.routerDetailAliaSearchKey,
          routerDetailSeries: this.searchItem.routerDetailSeries,
          routerNumberSearchKey: this.searchItem.routerNumberSearchKey,
          routerType: this.searchItem.routerType
        })
      },
      onAdd () {
        this.addDialog = true
        this._getAllPrv({
          current: 1,
          customerNumId: this.customerNumId,
          pageSize: 200
        })
        // 清空数据
        this.addItem = {
          children: [],
          customerNumId: '',
          customerSeries: '',
          destinationCity: '',
          destinationCityArea: '',
          destinationPrv: '',
          destinationTown: '',
          remark: '',
          routerAlia: '',
          routerNumber: '',
          routerType: 0,
          sourceCity: '',
          sourceCityArea: '',
          sourcePrv: '',
          sourceTown: ''
        }
        this.priceSetAddList = []
      },
      onAddConfirm () {
        this.addItem.customerNumId = this.customerNumId
        this._addRouterCustomerPrice(this.addItem)
      },
      onEditConfirm () {
        this.addItem.customerNumId = this.customerNumId
        this._updateRouterCustomerPrice(this.addItem)
      },
      onAddPrice () {
        this.innerAddVisible = true
        this._getCarTypeList({
          customerNumId: this.customerNumId
        })
        this._getCarSizeList({
          customerNumId: this.customerNumId
        })

        // 清空数据
        this.carTypeName = ''
        this.carSizeName = ''
        this.priceSetAddItem0 = {
          carTypeName: '',
          carTypeRealName: '',
          carSizeName: '',
          carSizeRealName: '',
          franchiseeProportion: 0,
          initDistance: 0,
          initPrice: '',
          overstepPrice: 0,
          routerCustomerType: 0,
          routerPriceId: '',
          routerType: 0,
          saleProportion: 0
        }
        this.priceSetAddItem1 = {
          carTypeName: '',
          carTypeRealName: '',
          carSizeName: '',
          carSizeRealName: '',
          franchiseeProportion: 0,
          initDistance: 0,
          initPrice: '',
          overstepPrice: 0,
          routerCustomerType: 1,
          routerPriceId: '',
          routerType: 0,
          saleProportion: 0
        }
      },
      onEditPrice (index, row) {
        this.innerEditVisible = true
        this.editPriceIndex = index
        this._getCarTypeList({
          customerNumId: this.customerNumId
        })
        this._getCarSizeList({
          customerNumId: this.customerNumId
        })

        // 把待编辑数据写入以下字段
        this.carTypeName = `${row.carTypeName}-${row.carTypeRealName}`
        this.carSizeName = `${row.carSizeName}-${row.carSizeRealName}`
        this.priceSetAddItem0 = this.priceSetAddList[index - 1]
        this.priceSetAddItem1 = this.priceSetAddList[index]
        // .log(this.addItem.children)
      },
      onEditPriceConfirm (index) {
        this.innerEditVisible = false
        // console.log(index)
        const item = this.carTypeName.split('-')
        this.priceSetAddItem0.carTypeName = item[0]
        this.priceSetAddItem0.carTypeRealName = item[1]
        this.priceSetAddItem1.carTypeName = item[0]
        this.priceSetAddItem1.carTypeRealName = item[1]

        const item1 = this.carSizeName.split('-')
        this.priceSetAddItem0.carSizeName = item1[0]
        this.priceSetAddItem0.carSizeRealName = item1[1]
        this.priceSetAddItem1.carSizeName = item1[0]
        this.priceSetAddItem1.carSizeRealName = item1[1]

        this.priceSetAddList[index - 1] = this.priceSetAddItem0
        this.priceSetAddList[index] = this.priceSetAddItem1

        this.addItem.children[index - 1] = {
          carTypeName: item[0],
          carSizeName: item1[0],
          routerType: 0,
          routerPriceList: [this.priceSetAddItem0]
        }
        this.addItem.children[index] = {
          carTypeName: item[0],
          carSizeName: item1[0],
          routerType: 0,
          routerPriceList: [this.priceSetAddItem1]
        }
      },
      onDeleteDetailPrice (index, row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._deleteRouterCustomerPrice({
            customerNumId: this.customerNumId,
            routerPriceId: row.routerPriceId
          }, index)
        }).catch(() => {
          console.log('取消删除')
        })
      },
      onAddPriceConfirm () {
        this.innerAddVisible = false

        const item = this.carTypeName.split('-')
        this.priceSetAddItem0.carTypeName = item[0]
        this.priceSetAddItem0.carTypeRealName = item[1]
        this.priceSetAddItem1.carTypeName = item[0]
        this.priceSetAddItem1.carTypeRealName = item[1]

        const item1 = this.carSizeName.split('-')
        this.priceSetAddItem0.carSizeName = item1[0]
        this.priceSetAddItem0.carSizeRealName = item1[1]
        this.priceSetAddItem1.carSizeName = item1[0]
        this.priceSetAddItem1.carSizeRealName = item1[1]

        this.priceSetAddList.push(this.priceSetAddItem0)
        this.priceSetAddList.push(this.priceSetAddItem1)

        this.addItem.children.push({
          carTypeName: item[0],
          carSizeName: item1[0],
          routerType: 0,
          routerPriceList: [this.priceSetAddItem0, this.priceSetAddItem1]
        })
      },
      onDeleteCustomerPrice (index, row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._deleteRouterByRouterId({
            customerNumId: this.customerNumId,
            routerDetailSeries: row.routerDetailSeries
          }, index)
        }).catch(() => {
          console.log('取消删除')
        })
      },
      onEditCustomerPrice (index, row) {
        this._getAllPrv({
          current: 1,
          customerNumId: this.customerNumId,
          pageSize: 200
        })
        // console.log(row)
        this._getConsumerRouterPriceByRouterId({
          consumerSeries: row.customerSeries,
          customerNumId: this.customerNumId,
          routerDetailSeries: row.routerDetailSeries,
          routerType: 0
        })
        this.editDialog = true
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
