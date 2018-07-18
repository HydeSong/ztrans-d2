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
        <!--<el-form-item>-->
          <!--<el-select v-model="searchItem.routerAliaSearchKey" placeholder="所在地区">-->
            <!--<el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.routerAlia"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-select v-model="searchItem.saleId" placeholder="销售员" clearable>
            <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>-->
          <!--<el-select v-model="searchItem.carType" placeholder="客户类型">-->
            <!--<el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-select v-model="searchItem.carType" placeholder="服务类型">-->
            <!--<el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
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
        <!--<el-table-column-->
          <!--prop="carTypeName"-->
          <!--label="客户类型">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="wetherTakeover"-->
          <!--label="服务类型">-->
        <!--</el-table-column>-->
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
          width="100">
          <template slot-scope="scope">
            <el-button @click="onView(scope.$index, scope.row)" type="text" size="small">查看</el-button>
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
        <div class="content">
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div class="block">
          联系人信息
          <el-button style="float: right; padding: 2px 0" type="text">添加联系人</el-button>
        </div>

      </el-dialog>
    </template>
  </d2-container>
</template>

<script>
  import { getAllMasterCustomer, getAllSaleList } from '@/api/customer'
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
        searching: false,
        popDialog: false,
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
      _getAllSaleList (params) {
        getAllSaleList(params).then(res => {
          if (res.code === 0) {
            this.customerSales = res.customerSales
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
          saleId: this.searchItem.saleId,
          contactNameSearchKey: this.searchItem.contactNameSearchKey,
          customerNameSearchKey: this.searchItem.customerNameSearchKey,
          mobilePhoneSearchKey: this.searchItem.mobilePhoneSearchKey,
          registerEndTime: this.searchItem.registerEndTime,
          registerStartTime: this.searchItem.registerStartTime
        }
        this._getAllMasterCustomer(params)
      },
      onRegisterTimeChange (time) {
        this.searchItem.registerStartTime = time[0]
        this.searchItem.registerEndTime = time[1]
      },
      onView () {
        this.popDialog = true
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
      padding: 10px 0;
      text-align: left;
    }
    .pagination-wrapper {
      padding: 10px 0;
      text-align: right;
    }
  }
</style>
