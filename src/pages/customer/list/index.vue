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
            <el-select v-model="editCustomerItem.serviceType" placeholder="服务类型" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editCustomerItem.caculateType" placeholder="结算方式" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editCustomerItem.checkStatus" placeholder="审核状态" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editCustomerItem.cityAreaName" placeholder="区Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editCustomerItem.cityName" placeholder="市Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editCustomerItem.customerLevel" placeholder="客户级别Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editCustomerItem.customerSource" placeholder="客户来源" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editCustomerItem.customerType" placeholder="客户类型Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editCustomerItem.orderLevel" placeholder="下单级别Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editCustomerItem.prvName" placeholder="省Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editCustomerItem.saleId" placeholder="销售ID" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editCustomerItem.checkRemark" placeholder="审核备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editCustomerItem.customerName" placeholder="大客户名字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editCustomerItem.customerNumId" placeholder="用户id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editCustomerItem.customerSimpleCode" placeholder="大客户简码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editCustomerItem.detailAddress" placeholder="详细地址"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editCustomerItem.finalDate" placeholder="最后合作日期"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editCustomerItem.series" placeholder="大客户Id"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCustomerPopDialog = false">取 消</el-button>
          <el-button type="primary" @click="onEditCustomerConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增客户" :visible.sync="addCustomerPopDialog">
        <el-form :inline="true" :model="addCustomerItem">
          <el-form-item>
            <el-select v-model="addCustomerItem.serviceType" placeholder="服务类型" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addCustomerItem.caculateType" placeholder="结算方式" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addCustomerItem.checkStatus" placeholder="审核状态" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addCustomerItem.cityAreaName" placeholder="区Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addCustomerItem.cityName" placeholder="市Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addCustomerItem.customerLevel" placeholder="客户级别Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addCustomerItem.customerSource" placeholder="客户来源" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addCustomerItem.customerType" placeholder="客户类型Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addCustomerItem.orderLevel" placeholder="下单级别Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addCustomerItem.prvName" placeholder="省Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addCustomerItem.saleId" placeholder="销售ID" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addCustomerItem.checkRemark" placeholder="审核备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addCustomerItem.customerName" placeholder="大客户名字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addCustomerItem.customerNumId" placeholder="用户id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addCustomerItem.customerSimpleCode" placeholder="大客户简码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addCustomerItem.detailAddress" placeholder="详细地址"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addCustomerItem.finalDate" placeholder="最后合作日期"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addCustomerItem.series" placeholder="大客户Id"></el-input>
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
            <el-input v-model="editContactItem.activeDtme" placeholder="激活时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editContactItem.commendFranchisee" placeholder="推荐加盟商"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editContactItem.commendSale" placeholder="推荐销售"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editContactItem.contactName" placeholder="客户联系人姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editContactItem.contactOpenId" placeholder="客户联系人openid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editContactItem.contactPhone" placeholder="客户联系人电话"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editContactItem.customerContactId" placeholder="联系人ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editContactItem.customerMasterId" placeholder="大客户ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="editContactItem.customerNumId" placeholder="用户id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="editContactItem.activeStatus" placeholder="激活状态Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editContactPopDialog = false">取 消</el-button>
          <el-button type="primary" @click="onEditContactConfirm">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增联系人" :visible.sync="addContactPopDialog">
        <el-form :inline="true" :model="addContactItem">
          <el-form-item>
            <el-input v-model="addContactItem.activeDtme" placeholder="激活时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addContactItem.commendFranchisee" placeholder="推荐加盟商"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addContactItem.commendSale" placeholder="推荐销售"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addContactItem.contactName" placeholder="客户联系人姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addContactItem.contactPhone" placeholder="客户联系人电话"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addContactItem.customerContactId" placeholder="联系人ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addContactItem.customerMasterId" placeholder="大客户ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addContactItem.customerNumId" placeholder="用户id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="addContactItem.activeStatus" placeholder="激活状态Id" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
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
      this._getAllSaleList({
        customerNumId: this.customerNumId,
        franchiseeId: this.franchiseeId
      })
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
    methods: {
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
            console.log(this.customerDetail)
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
        addMasterCustomer(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.addCustomerPopDialog = false
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
        updateMasterCustomer(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.editCustomerPopDialog = false
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
      },
      onEditCustomer (index, row) {
        this.editCustomerPopDialog = true
        this.editCustomerItem = Object.assign({}, this.editCustomerItem, row)
      },
      onEditCustomerConfirm () {
        this._updateMasterCustomer(this.editCustomerItem)
      },
      onEditContact () {
        this.editContactPopDialog = true
      },
      onAddContact () {
        this.addContactPopDialog = true
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
