<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem">
        <el-form-item>
          <el-select v-model="searchItem.motorcadeId" placeholder="车队ID" clearable>
            <el-option v-for="(item, index) in motorcadeNameList" :key="index" :label="item.motorcadeCar" :value="item.motorcadeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchItem.checkStatus" placeholder="审核状态" clearable>
            <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItem.carPlateNumberSearchKey" placeholder="车牌号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItem.driverNameSearchKey" placeholder="司机姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItem.driverPhoneSearchKey" placeholder="司机手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" icon="el-icon-search" :loading="searching">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAddCar" icon="el-icon-plus">新增</el-button>
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
          prop="carPlateNumber"
          label="车牌号">
        </el-table-column>
        <el-table-column
          prop="carTypeRealName"
          label="车型">
        </el-table-column>
        <el-table-column
          prop="driverName"
          label="司机姓名">
        </el-table-column>
        <el-table-column
          prop="district"
          label="省/市/区">
        </el-table-column>
        <el-table-column
          prop="driverIdentityId"
          label="司机身份证">
        </el-table-column>
        <el-table-column
          prop="driverPhone"
          label="司机手机">
        </el-table-column>
        <el-table-column
          prop="activeStatusName"
          label="激活状态">
        </el-table-column>
        <el-table-column
          prop="checkStatusName"
          label="审核状态">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button @click="onEditCar(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="onDetailCar(scope.$index, scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="onDeleteCar(scope.$index, scope.row)" type="text" size="small">删除</el-button>
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
      <el-dialog title="查看车辆" :visible.sync="detailCarDialog">
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
              <el-button @click="onAssignConfirm(scope.row)" type="text" size="small">确定此人接单</el-button>
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
      <el-dialog title="添加车辆" :visible.sync="addCarPopDialog">
        <el-form :inline="true" :model="addCarItem" label-position="left">
          <el-form-item label="车队名字">
            <el-select v-model="addCarItem.serviceType" clearable>
              <el-option v-for="(item, index) in serviceTypeModels" :key="index" :label="item.serviceTypeName" :value="item.serviceTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆颜色">
            <el-select v-model="addCarItem.caculateType" clearable>
              <el-option v-for="(item, index) in customerCaclulateTypeModels" :key="index" :label="item.customerCaclulateTypeName" :value="item.customerCaclulateTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车型">
            <el-select v-model="addCarItem.checkStatus" clearable>
              <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆品牌">
            <el-select v-model="addCarItem.checkStatus" clearable>
              <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="省/市/区">
            <el-select v-model="addCarItem.prvName" clearable>
              <el-option v-for="(item, index) in customerSales" :key="index" :label="item.salePersonName" :value="item.salePersonId"></el-option>
            </el-select>
            <!-- addCustomerItem.cityName addCustomerItem.cityAreaName -->
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="addCarItem.finalDate"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-upload
                list-type="picture-card"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList2">
                <i class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">驾驶证</div>
              </el-upload>
            </el-col>
            <el-col :span="6">
              <el-upload
                list-type="picture-card"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList2">
                <i class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">行驶证</div>
              </el-upload>
            </el-col>
            <el-col :span="6">
              <el-upload
                list-type="picture-card"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList2">
                <i class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">身份证</div>
              </el-upload>
            </el-col>
            <el-col :span="6">
              <el-upload
                list-type="picture-card"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList2">
                <i class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">人车合照</div>
              </el-upload>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCarPopDialog = false">取 消</el-button>
          <el-button type="primary" @click="onAddCarConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaList } from '@/api/schedule'
  import { getCarTypeList } from '@/api/order'
  import { getAllCar, deleteCar, getMotorcadeList } from '@/api/truck'
  import { getCheckStatus } from '@/api/dictionary'
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
          checkStatus: '',
          carPlateNumberSearchKey: '',
          driverNameSearchKey: '',
          driverPhoneSearchKey: '',
          motorcadeId: ''
        },
        addCarItem: {
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
        tableData: [],
        searching: false,
        detailCarDialog: false,
        driverModel: [],
        addCarPopDialog: false,
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
        },
        motorcadeNameList: [],
        checkIdAndCheckStatus: []
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
        this.tableData.forEach((item) => {
          item.district = `${item.prvRealName}/${item.cityRealName}/${item.cityAreaRealName}`
        })
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
      this.onSearch()
      // 获取字典接口数据
      this._getCheckStatus({
        customerNumId: this.customerNumId
      })
      this._getMotorcadeList({
        franchiseeid: ''
      })
    },
    methods: {
      _getCheckStatus (params) {
        getCheckStatus(params).then(res => {
          if (res.code === 0) {
            this.checkIdAndCheckStatus = res.checkIdAndCheckStatus
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getMotorcadeList (params) {
        getMotorcadeList(params).then(res => {
          if (res.code === 0) {
            this.motorcadeNameList = res.motorcadeNameList
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _deleteCar (params, index) {
        deleteCar(params).then(res => {
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
      _getAllCar (params) {
        getAllCar(params).then(res => {
          if (res.code === 0) {
            this.tableData = res.cars
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
        this._getAllCar({
          current: this.currentPage,
          pageSize: this.pageSize,
          customerNumId: this.customerNumId,
          checkStatus: this.searchItem.checkStatus,
          carPlateNumberSearchKey: this.searchItem.carPlateNumberSearchKey,
          driverNameSearchKey: this.searchItem.driverNameSearchKey,
          driverPhoneSearchKey: this.searchItem.driverPhoneSearchKey,
          motorcadeId: this.searchItem.motorcadeId
        })
      },
      onAddCar () {
        this.addCarPopDialog = true
      },
      onAddCarConfirm () {

      },
      onEditCar () {
      },
      onDetailCar () {
      },
      onDeleteCar (index, row) {
        console.log(row)
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._deleteCar({
            customerNumId: this.customerNumId,
            driverId: row.carId
          }, index)
        }).catch(() => {
          console.log('取消删除')
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
    .el-dialog__body {
      text-align: center;
    }
  }
</style>
