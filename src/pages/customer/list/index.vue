<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem">
        <el-form-item>
          <el-input v-model="searchItem.customerNameSearchKey" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItem.contactNameSearchKey" placeholder="联系人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItem.mobilePhoneSearchKey" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchItem.saleId" placeholder="销售员" clearable>
            <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
          </el-select>
        </el-form-item>
        <el-date-picker
          v-model="searchItem.registerTime"
          @change="onRegisterTimeChange"
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
          prop="customerName"
          label="客户名称">
        </el-table-column>
        <el-table-column
          width="140"
          prop="customerSimpleCode"
          label="客户代码">
        </el-table-column>
        <el-table-column
          prop="prvCityArea"
          label="所在地区">
        </el-table-column>
        <el-table-column
          prop="contactName"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="contactPhone"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="saleName"
          label="销售员">
        </el-table-column>
        <el-table-column
          prop="createDtme"
          label="注册日期">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button @click="onEditCustomer(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="onView(scope.$index, scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="onDeleteCustomer(scope.$index, scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
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
      <el-dialog title="客户详情" :visible.sync="popDialog">
        <div class="block">
          客户信息
        </div>
        <div class="block">
          <el-row>
            <el-col :span="12">
              <ul class="i-list">
                <li>客户名称：{{customerDetail.customerName}}</li>
                <li>所在地区：{{customerDetail.prvRealName}}{{customerDetail.cityRealName}}{{customerDetail.cityAreaRealName}}</li>
                <li>销售员：{{customerDetail.saleName}}</li>
                <li>注册时间：{{customerDetail.finalDate}}</li>
              </ul>
            </el-col>
            <el-col :span="12">
              <ul class="i-list">
                <li>客户代码：{{customerDetail.customerSimpleCode}}</li>
                <li>详细地址：{{customerDetail.detailAddress}}</li>
                <li>客户类型：{{customerDetail.customerTypeName}}</li>
                <li>服务类型：{{customerDetail.serviceTypeName}}</li>
              </ul>
            </el-col>
          </el-row>
        </div>
        <div class="block">
          联系人信息
          <el-button style="padding: 2px 0" type="text" @click="onAddContact">添加联系人</el-button>
        </div>
        <div class="block">
          <el-table
            :data="constantDetail"
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
              prop="contactName"
              label="联系人">
            </el-table-column>
            <el-table-column
              width="140"
              prop="contactPhone"
              label="联系电话">
            </el-table-column>
            <el-table-column
              prop="wxName"
              label="微信名称">
            </el-table-column>
            <el-table-column
              prop="activeDtme"
              label="创建日期">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="onEditContact(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="onDeleteContact(scope.$index, scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <el-dialog title="编辑客户" :visible.sync="editCustomerPopDialog">
        <el-form :inline="true" :model="editCustomerItem">
          <el-form-item>
            服务类型
            <el-select v-model="editCustomerItem.serviceType" clearable>
              <el-option v-for="(item, index) in serviceTypeModels" :key="index" :label="item.serviceTypeName" :value="item.serviceTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            结算方式
            <el-select v-model="editCustomerItem.caculateType" clearable>
              <el-option v-for="(item, index) in customerCaclulateTypeModels" :key="index" :label="item.customerCaclulateTypeName" :value="item.customerCaclulateTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            审核状态
            <el-select v-model="editCustomerItem.checkStatus" clearable>
              <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            省/市/区
            <el-select v-model="editCustomerItem.prvName" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
            <!-- editCustomerItem.cityName editCustomerItem.cityAreaName-->
          </el-form-item>
          <el-form-item>
            客户级别
            <el-select v-model="editCustomerItem.customerLevel" clearable>
              <el-option v-for="(item, index) in customerLevelModels" :key="index" :label="item.customerLevelName" :value="item.customerLevelId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            客户来源
            <el-select v-model="editCustomerItem.customerSource" clearable>
              <el-option v-for="(item, index) in customerSourceModels" :key="index" :label="item.customerSourceName" :value="item.customerSourceId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            客户类型
            <el-select v-model="editCustomerItem.customerType" clearable>
              <el-option v-for="(item, index) in customerTypeModels" :key="index" :label="item.customerTypeName" :value="item.customerTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            下单级别
            <el-select v-model="editCustomerItem.orderLevel" clearable>
              <el-option v-for="(item, index) in customerOrderLevelModels" :key="index" :label="item.customerOrderLevelName" :value="item.customerOrderLevelId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            销售
            <el-select v-model="editCustomerItem.saleId" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            最后合作日期
            <el-date-picker
              v-model="editCustomerItem.finalDate"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            大客户名字
            <el-input v-model="editCustomerItem.customerName"></el-input>
          </el-form-item>
          <el-form-item>
            大客户简码
            <el-input v-model="editCustomerItem.customerSimpleCode"></el-input>
          </el-form-item> 
          <el-form-item>
            详细地址
            <el-input type="textarea" v-model="editCustomerItem.detailAddress"></el-input>
          </el-form-item>
          <el-form-item>
            审核备注
            <el-input type="textarea" v-model="editCustomerItem.checkRemark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCustomerPopDialog = false">取 消</el-button>
          <el-button type="primary" @click="onEditCustomerConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加客户" :visible.sync="addCustomerPopDialog">
        <el-form :inline="true" :model="addCustomerItem">
          <el-form-item>
            服务类型
            <el-select v-model="addCustomerItem.serviceType" clearable>
              <el-option v-for="(item, index) in serviceTypeModels" :key="index" :label="item.serviceTypeName" :value="item.serviceTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            结算方式
            <el-select v-model="addCustomerItem.caculateType" clearable>
              <el-option v-for="(item, index) in customerCaclulateTypeModels" :key="index" :label="item.customerCaclulateTypeName" :value="item.customerCaclulateTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            审核状态
            <el-select v-model="addCustomerItem.checkStatus" clearable>
              <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            省/市/区
            <el-select v-model="addCustomerItem.prvName" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
            <!-- addCustomerItem.cityName addCustomerItem.cityAreaName -->
          </el-form-item>
          <el-form-item>
            客户级别
            <el-select v-model="addCustomerItem.customerLevel" clearable>
              <el-option v-for="(item, index) in customerLevelModels" :key="index" :label="item.customerLevelName" :value="item.customerLevelId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            客户来源
            <el-select v-model="addCustomerItem.customerSource" clearable>
              <el-option v-for="(item, index) in customerSourceModels" :key="index" :label="item.customerSourceName" :value="item.customerSourceId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            客户类型
            <el-select v-model="addCustomerItem.customerType" clearable>
              <el-option v-for="(item, index) in customerTypeModels" :key="index" :label="item.customerTypeName" :value="item.customerTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            下单级别
            <el-select v-model="addCustomerItem.orderLevel" clearable>
              <el-option v-for="(item, index) in customerOrderLevelModels" :key="index" :label="item.customerOrderLevelName" :value="item.customerOrderLevelId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            销售
            <el-select v-model="addCustomerItem.saleId" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            最后合作日期
            <el-date-picker
              v-model="addCustomerItem.finalDate"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            大客户名字
            <el-input v-model="addCustomerItem.customerName"></el-input>
          </el-form-item>
          <el-form-item>
            大客户简码
            <el-input v-model="addCustomerItem.customerSimpleCode"></el-input>
          </el-form-item>
          <el-form-item>
            详细地址
            <el-input type="textarea" v-model="addCustomerItem.detailAddress"></el-input>
          </el-form-item>
          <el-form-item>
            审核备注
            <el-input type="textarea" v-model="addCustomerItem.checkRemark"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCustomerPopDialog = false">取 消</el-button>
          <el-button type="primary" @click="onAddCustomerConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="编辑联系人" :visible.sync="editContactPopDialog">
        <el-form :inline="true" :model="editContactItem">
          <el-form-item>
            推荐加盟商
            <el-input v-model="editContactItem.commendFranchisee"></el-input>
          </el-form-item>
          <el-form-item>
            推荐销售
            <el-input v-model="editContactItem.commendSale"></el-input>
          </el-form-item>
          <el-form-item>
            联系人姓名
            <el-input v-model="editContactItem.contactName"></el-input>
          </el-form-item>
          <el-form-item>
            联系人电话
            <el-input v-model="editContactItem.contactPhone"></el-input>
          </el-form-item>
          <el-form-item>
            激活时间
            <el-date-picker
              v-model="editContactItem.activeDtme"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            激活状态
            <el-select v-model="editContactItem.activeStatus" clearable>
              <el-option v-for="(item, index) in activeStatusModels" :key="index" :label="item.activeStatusName" :value="item.activeStatus"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editContactPopDialog = false">取 消</el-button>
          <el-button type="primary" @click="onEditContactConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加联系人" :visible.sync="addContactPopDialog">
        <el-form :inline="true" :model="addContactItem">
          <el-form-item>
            推荐加盟商
            <el-input v-model="addContactItem.commendFranchisee"></el-input>
          </el-form-item>
          <el-form-item>
            推荐销售
            <el-input v-model="addContactItem.commendSale"></el-input>
          </el-form-item>
          <el-form-item>
            客户联系人姓名
            <el-input v-model="addContactItem.contactName"></el-input>
          </el-form-item>
          <el-form-item>
            客户联系人电话
            <el-input v-model="addContactItem.contactPhone"></el-input>
          </el-form-item>
          <el-form-item>
            激活状态
            <el-select v-model="addContactItem.activeStatus" clearable>
              <el-option v-for="(item, index) in activeStatusModels" :key="index" :label="item.activeStatusName" :value="item.activeStatus"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            激活时间
            <el-date-picker
              v-model="addContactItem.activeDtme"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addContactPopDialog = false">取 消</el-button>
          <el-button type="primary" @click="onAddContactConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </d2-container>
</template>

<script>
  import { getAllMasterCustomer, getMasterCustomerDetail, deleteMasterCustomer, addMasterCustomer, getAllSaleList, deleteCustomerContact, updateMasterCustomer, addCustomerContact, updateCustomerContact } from '@/api/customer'
  import { getCheckStatus, getActiveStatus, getCustomerCaclulateType, getCustomerJob, getCustomerLevel, getCustomerOrderLevel, getCustomerSex, getCustomerSource, getCustomerType, getOperateStatus, getAllCity, getAllCityArea, getAllPrv, getAllTown, getServiceType } from '@/api/dictionary'
  import Cookies from 'js-cookie'
  export default {
    data () {
      return {
        value5: '',
        customerNumId: Cookies.get('__user__customernumid'),
        franchiseeId: '',
        currentPage: 1,
        pageSize: 200,
        searchItem: {
          saleId: '',
          contactNameSearchKey: '',
          customerNameSearchKey: '',
          mobilePhoneSearchKey: '',
          registerEndTime: '',
          registerStartTime: '',
          registerTime: ''
        },
        tableData: [],
        customerSales: [],
        customerDetail: {},
        constantDetail: [],
        searching: false,
        popDialog: false,
        editCustomerPopDialog: false,
        addCustomerPopDialog: false,
        editContactPopDialog: false,
        addContactPopDialog: false,
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
        editCustomerItem: {
          caculateType: '',
          checkRemark: '',
          checkStatus: '',
          cityAreaName: '',
          cityName: '',
          customerLevel: '',
          customerName: '',
          customerNumId: '',
          customerSimpleCode: '',
          customerSource: '',
          customerType: '',
          detailAddress: '',
          finalDate: '',
          orderLevel: '',
          prvName: '',
          saleId: '',
          series: '',
          serviceType: ''
        },
        addCustomerItem: {
          caculateType: '',
          checkRemark: '',
          checkStatus: '',
          cityAreaName: '',
          cityName: '',
          customerLevel: '',
          customerName: '',
          customerNumId: '',
          customerSimpleCode: '',
          customerSource: '',
          customerType: '',
          detailAddress: '',
          finalDate: '',
          orderLevel: '',
          prvName: '',
          saleId: '',
          serviceType: ''
        },
        editContactItem: {
          activeDtme: '',
          activeStatus: '',
          commendFranchisee: '',
          commendSale: '',
          contactName: '',
          contactOpenId: '',
          contactPhone: '',
          customerContactId: '',
          customerMasterId: '',
          customerNumId: ''
        },
        addContactItem: {
          activeDtme: '',
          activeStatus: '',
          commendFranchisee: '',
          commendSale: '',
          contactName: '',
          contactPhone: '',
          customerContactId: '',
          customerMasterId: '',
          customerNumId: ''
        },
        checkIdAndCheckStatus: [],
        activeStatusModels: [],
        customerCaclulateTypeModels: [],
        customerJobModels: [],
        customerLevelModels: [],
        customerOrderLevelModels: [],
        customerSexModels: [],
        customerSourceModels: [],
        customerTypeModels: [],
        operateIdAndoperateStatus: [],
        townNameAndTownIdModel: [],
        prvNameAndPrvIds: [],
        cityAreaNameAndCityAreaIdModel: [],
        cityeNameAndCityeIds: [],
        serviceTypeModels: []
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
      this._getAllSaleList({
        customerNumId: this.customerNumId,
        franchiseeId: this.franchiseeId
      })
      // 进入页面加载全部数据
      this.onSearch()

      // 获取字典接口数据
      this._getCheckStatus({
        customerNumId: this.customerNumId
      })
      this._getActiveStatus({
        customerNumId: this.customerNumId
      })
      this._getCustomerCaclulateType({
        customerNumId: this.customerNumId
      })
      this._getCustomerSource({
        customerNumId: this.customerNumId
      })
      this._getCustomerType({
        customerNumId: this.customerNumId
      })
      this._getOperateStatus({
        customerNumId: this.customerNumId
      })
      this._getCustomerSource({
        customerNumId: this.customerNumId
      })
      this._getCustomerSex({
        customerNumId: this.customerNumId
      })
      this._getCustomerOrderLevel({
        customerNumId: this.customerNumId
      })
      this._getCustomerLevel({
        customerNumId: this.customerNumId
      })
      this._getCustomerJob({
        customerNumId: this.customerNumId
      })
      this._getServiceType({
        customerNumId: this.customerNumId
      })
      // 省市区联动数据
    },
    methods: {
      _getServiceType (params) {
        getServiceType(params).then(res => {
          if (res.code === 0) {
            this.serviceTypeModels = res.serviceTypeModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllTown (params) {
        getAllTown(params).then(res => {
          if (res.code === 0) {
            this.townNameAndTownIdModel = res.townNameAndTownIdModel
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllPrv (params) {
        getAllPrv(params).then(res => {
          if (res.code === 0) {
            this.prvNameAndPrvIds = res.prvNameAndPrvIds
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllCityArea (params) {
        getAllCityArea(params).then(res => {
          if (res.code === 0) {
            this.cityAreaNameAndCityAreaIdModel = res.cityAreaNameAndCityAreaIdModel
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllCity (params) {
        getAllCity(params).then(res => {
          if (res.code === 0) {
            this.cityeNameAndCityeIds = res.cityeNameAndCityeIds
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getCheckStatus (params) {
        getCheckStatus(params).then(res => {
          if (res.code === 0) {
            this.checkIdAndCheckStatus = res.checkIdAndCheckStatus
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getActiveStatus (params) {
        getActiveStatus(params).then(res => {
          if (res.code === 0) {
            this.activeStatusModels = res.activeStatusModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getCustomerCaclulateType (params) {
        getCustomerCaclulateType(params).then(res => {
          if (res.code === 0) {
            this.customerCaclulateTypeModels = res.customerCaclulateTypeModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getCustomerJob (params) {
        getCustomerJob(params).then(res => {
          if (res.code === 0) {
            this.customerJobModels = res.customerJobModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getCustomerLevel (params) {
        getCustomerLevel(params).then(res => {
          if (res.code === 0) {
            this.customerLevelModels = res.customerLevelModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getCustomerOrderLevel (params) {
        getCustomerOrderLevel(params).then(res => {
          if (res.code === 0) {
            this.customerOrderLevelModels = res.customerOrderLevelModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getCustomerSex (params) {
        getCustomerSex(params).then(res => {
          if (res.code === 0) {
            this.customerSexModels = res.customerSexModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getCustomerSource (params) {
        getCustomerSource(params).then(res => {
          if (res.code === 0) {
            this.customerSourceModels = res.customerSourceModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getCustomerType (params) {
        getCustomerType(params).then(res => {
          if (res.code === 0) {
            this.customerTypeModels = res.customerTypeModels
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getOperateStatus (params) {
        getOperateStatus(params).then(res => {
          if (res.code === 0) {
            this.operateIdAndoperateStatus = res.operateIdAndoperateStatus
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllMasterCustomer (params) {
        getAllMasterCustomer(params).then(res => {
          if (res.code === 0) {
            this.tableData = res.customerMaster
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getMasterCustomerDetail (params) {
        getMasterCustomerDetail(params).then(res => {
          if (res.code === 0) {
            this.constantDetail = res.constantDetailModel
            this.customerDetail = res.customerMaster
            // 数据大客户编辑
            this.editCustomerItem = Object.assign({}, this.editCustomerItem, res.customerMaster)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _deleteMasterCustomer (params, index) {
        deleteMasterCustomer(params).then(res => {
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
      _addMasterCustomer (params) {
        console.log(params)
        addMasterCustomer(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.addCustomerPopDialog = false
            this.onSearch()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _updateCustomerContact (params) {
        updateCustomerContact(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.editContactPopDialog = false
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _updateMasterCustomer (params) {
        console.log(params)
        updateMasterCustomer(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.editCustomerPopDialog = false
            this.onSearch()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllSaleList (params) {
        getAllSaleList(params).then(res => {
          if (res.code === 0) {
            this.customerSales = res.customerSales
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _deleteCustomerContact (params, index) {
        deleteCustomerContact(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.constantDetail.splice(index, 1)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _addCustomerContact (params) {
        addCustomerContact(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.addContactPopDialog = false
            // 刷新数据
            this._getMasterCustomerDetail({
              customerNumId: this.customerNumId,
              customerMasterId: this.addContactItem.customerMasterId
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },
      onSearch () {
        this._getAllMasterCustomer({
          current: this.currentPage,
          pageSize: this.pageSize,
          customerNumId: this.customerNumId,
          saleId: this.searchItem.saleId,
          contactNameSearchKey: this.searchItem.contactNameSearchKey,
          customerNameSearchKey: this.searchItem.customerNameSearchKey,
          mobilePhoneSearchKey: this.searchItem.mobilePhoneSearchKey,
          registerEndTime: this.searchItem.registerEndTime,
          registerStartTime: this.searchItem.registerStartTime
        })
      },
      onAdd () {
        this.addCustomerPopDialog = true
        this.addCustomerItem.customerNumId = this.customerNumId
      },
      onAddCustomerConfirm () {
        this._addMasterCustomer(this.addCustomerItem)
      },
      onRegisterTimeChange (time) {
        this.searchItem.registerStartTime = time[0]
        this.searchItem.registerEndTime = time[1]
      },
      onView (index, row) {
        this.popDialog = true
        this._getMasterCustomerDetail({
          customerNumId: this.customerNumId,
          customerMasterId: row.customerMasterId
        })
        this.addContactItem.customerContactId = row.saleId
        this.addContactItem.customerMasterId = row.customerMasterId
        this.addContactItem.customerNumId = this.customerNumId
      },
      onEditCustomer (index, row) {
        this.editCustomerPopDialog = true
        this._getMasterCustomerDetail({
          customerNumId: this.customerNumId,
          customerMasterId: row.customerMasterId
        })
        this.editCustomerItem.customerNumId = this.customerNumId
        this.editCustomerItem.series = row.customerMasterId
      },
      onEditCustomerConfirm () {
        this._updateMasterCustomer(this.editCustomerItem)
      },
      onEditContact (index, row) {
        this.editContactPopDialog = true
        console.log(row)
        this.editContactItem = row
      },
      onAddContact () {
        this.addContactPopDialog = true
        // 清空数据
        this.addContactItem.activeDtme = ''
        this.addContactItem.activeStatus = ''
        this.addContactItem.commendFranchisee = ''
        this.addContactItem.commendSale = ''
        this.addContactItem.contactName = ''
        this.addContactItem.contactPhone = ''
      },
      onDeleteCustomer (index, row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._deleteMasterCustomer({
            customerNumId: this.customerNumId,
            series: row.customerMasterId
          }, index)
        }).catch(() => {
          console.log('取消删除')
        })
      },
      onDeleteContact (index, row) {
        console.log(index, row)
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._deleteCustomerContact({
            customerNumId: this.customerNumId,
            customerContactId: row.customerContactId
          }, index)
        }).catch(() => {
          console.log('取消删除')
        })
      },
      onEditContactConfirm () {
        this._updateCustomerContact(this.editContactItem)
      },
      onAddContactConfirm () {
        this._addCustomerContact(this.addContactItem)
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
  @import '~@/assets/style/public.scss';

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
