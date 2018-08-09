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
            <el-form-item label="起始点">
              <el-select v-model="addItem.sourcePrv" placeholder="请选择省" @change="onSourcePrvChange">
                <el-option
                  v-for="item in allPrv"
                  :key="item.prvId"
                  :label="item.prvName"
                  :value="item.prvId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.sourceCity" placeholder="请选择市" @change="onSourceCityChange">
                <el-option
                  v-for="item in allCity"
                  :key="item.cityId"
                  :label="item.cityName"
                  :value="item.cityId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.sourceCityArea" placeholder="请选择区" @change="onSourceCityAreaChange">
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
              <el-select v-model="addItem.destinationPrv" placeholder="请选择省" @change="onDestinationPrvChange">
                <el-option
                  v-for="item in allPrv"
                  :key="item.prvId"
                  :label="item.prvName"
                  :value="item.prvId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.destinationCity" placeholder="请选择市" @change="onDestinationCityChange">
                <el-option
                  v-for="item in allCity"
                  :key="item.cityId"
                  :label="item.cityName"
                  :value="item.cityId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.destinationCityArea" placeholder="请选择区" @change="onDestinationCityAreaChange">
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
                <el-button type="text" size="small" @click="onDeletePrice(scope.$index)" v-if="scope.$index % 2 === 1">删除</el-button>
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
              <el-input v-model="addItem.routerAlia" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="起始点">
              <el-select v-model="addItem.sourcePrv" placeholder="请选择省" @change="onSourcePrvChange">
                <el-option
                  v-for="item in allPrv"
                  :key="item.prvId"
                  :label="item.prvName"
                  :value="item.prvId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.sourceCity" placeholder="请选择市" @change="onSourceCityChange">
                <el-option
                  v-for="item in allCity"
                  :key="item.cityId"
                  :label="item.cityName"
                  :value="item.cityId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.sourceCityArea" placeholder="请选择区" @change="onSourceCityAreaChange">
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
              <el-select v-model="addItem.destinationPrv" placeholder="请选择省" @change="onDestinationPrvChange">
                <el-option
                  v-for="item in allPrv"
                  :key="item.prvId"
                  :label="item.prvName"
                  :value="item.prvId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.destinationCity" placeholder="请选择市" @change="onDestinationCityChange">
                <el-option
                  v-for="item in allCity"
                  :key="item.cityId"
                  :label="item.cityName"
                  :value="item.cityId">
                </el-option>
              </el-select>
              <el-select v-model="addItem.destinationCityArea" placeholder="请选择区" @change="onDestinationCityAreaChange">
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
                <el-button type="text" size="small" @click="onDeletePrice(scope.$index)" v-if="scope.$index % 2 === 1">删除</el-button>
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
  import { getRouterAliaList } from '@/api/schedule'
  import { getCarTypeList } from '@/api/order'
  import { getAllRouterCustomerPrice, getMasterCustomerList, addRouterCustomerPrice, deleteRouterByRouterId, deleteRouterCustomerPrice, updateBatchRouterPrice } from '@/api/price'
  import { getAllPrv, getAllCity, getAllCityArea, getAllTown } from '@/api/dictionary'
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
        searchItem: {
          carSizeNameAliaSearchKey: '',
          customerSeries: '',
          routerDetailAliaSearchKey: '',
          routerDetailSeries: '',
          routerNumberSearchKey: '',
          routerType: ''
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
          sourceTown: ''
        },
        priceSetAddList: [],
        priceSetAddItem0: {
          carTypeName: '',
          carTypeRealName: '',
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
        carTypeName: ''
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
      this._getMasterCustomerList({
        customerNumId: this.customerNumId,
        saleId: ''
      })
      this.onSearch()
    },
    methods: {
      routerCustomerTypeFormat (val) {
        return val.routerCustomerType === 0 ? '客户报价' : '司机报价'
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
      _addRouterCustomerPrice (params) {
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
        this._updateBatchRouterPrice(this.addItem)
      },
      onAddPrice () {
        this.innerAddVisible = true
        this._getCarTypeList({
          customerNumId: this.customerNumId
        })

        // 清空数据
        this.carTypeName = ''
        this.priceSetAddItem0 = {
          carTypeName: '',
          carTypeRealName: '',
          franchiseeProportion: '',
          initDistance: '',
          initPrice: '',
          overstepPrice: '',
          routerCustomerType: 0,
          routerPriceId: '',
          routerType: '',
          saleProportion: ''
        }
        this.priceSetAddItem1 = {
          carTypeName: '',
          carTypeRealName: '',
          franchiseeProportion: '',
          initDistance: '',
          initPrice: '',
          overstepPrice: '',
          routerCustomerType: 1,
          routerPriceId: '',
          routerType: '',
          saleProportion: ''
        }
      },
      onDeletePrice (index) {
        let idx = ''
        if (index % 2 === 0) {
          idx = index + 1
        } else {
          idx = index - 1
        }
        this.priceSetAddList.splice(index, 1)
        this.priceSetAddList.splice(idx, 1)
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
        this.priceSetAddList.push(this.priceSetAddItem0)
        this.priceSetAddList.push(this.priceSetAddItem1)

        this.addItem.children.push({
          carTypeName: item[0],
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

        this.addItem.children = []

        if (row.routerPriceList && row.routerPriceList[0] && row.routerPriceList[0].carTypeName) {
          this.addItem.children.push({
            carTypeName: row.routerPriceList[0].carTypeName,
            routerType: 0,
            routerPriceList: row.routerPriceList
          })
        } else {
          this.addItem.children.push({
            carTypeName: '',
            routerType: 0,
            routerPriceList: []
          })
        }

        this.addItem.customerNumId = row.customerNumId
        this.addItem.customerSeries = row.customerSeries
        this.addItem.destinationCity = row.destinationCity
        this.addItem.destinationCityArea = row.destinationCityArea
        this.addItem.destinationPrv = row.destinationPrv
        this.addItem.destinationTown = row.destinationTown
        this.addItem.remark = row.remark
        this.addItem.routerAlia = row.routerAlia
        this.addItem.routerDetailSeries = row.routerDetailSeries
        this.addItem.routerNumber = row.routerNumber
        this.addItem.sourceCity = row.sourceCity
        this.addItem.sourceCityArea = row.sourceCityArea
        this.addItem.sourcePrv = row.sourcePrv
        this.addItem.sourceTown = row.sourceTown

        this.priceSetAddList = row.routerPriceList
        this.editDialog = true
      },
      onSourcePrvChange () {
        this.addItem.sourceCity = ''
        this.addItem.sourceCityArea = ''
        this.addItem.sourceTown = ''
        this._getAllCity({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.addItem.sourcePrv
        })
      },
      onSourceCityChange () {
        this.addItem.sourceCityArea = ''
        this.addItem.sourceTown = ''
        this._getAllCityArea({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.addItem.sourcePrv,
          cityId: this.addItem.sourceCity
        })
      },
      onSourceCityAreaChange () {
        this.addItem.sourceTown = ''
        this._getAllTown({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          cityAreaId: this.addItem.sourceCityArea
        })
      },
      onDestinationPrvChange () {
        this.addItem.destinationCity = ''
        this.addItem.destinationCityArea = ''
        this.addItem.destinationTown = ''
        this._getAllCity({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.addItem.destinationPrv
        })
      },
      onDestinationCityChange () {
        this.addItem.destinationCityArea = ''
        this.addItem.destinationTown = ''
        this._getAllCityArea({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.addItem.destinationPrv,
          cityId: this.addItem.destinationCity
        })
      },
      onDestinationCityAreaChange () {
        this.addItem.destinationTown = ''
        this._getAllTown({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          cityAreaId: this.addItem.destinationCityArea
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
