<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem">
        <el-form-item>
          <el-select v-model="searchItem.motorcadeId" placeholder="所属车队" clearable>
            <el-option v-for="(item, index) in motorcadeNameList" :key="index" :label="item.motorcadeCar" :value="item.motorcadeId"></el-option>
          </el-select>
        </el-form-item>12
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
          prop="carSizeRealName"
          label="尺寸">
        </el-table-column>
        <el-table-column
          prop="driverName"
          label="司机姓名">
        </el-table-column>
        <el-table-column
          prop="district"
          label="接单区域">
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
      <el-dialog title="车辆详情" :visible.sync="detailCarDialog">
        <el-row>
          <el-col :span="12">
            <ul class="i-list">
              <li>驾驶员姓名：{{carDetail.driverName}}</li>
              <li>驾驶员电话：{{carDetail.driverPhone}}</li>
              <li>驾驶员身份证：{{carDetail.driverIdentityId}}</li>
              <li>车牌号：{{carDetail.carPlateNumber}}</li>
              <li>车型：{{carDetail.carTypeRealName}}</li>
              <li>品牌：{{carDetail.carBrandRealName}}</li>
              <li>颜色：{{carDetail.carColourRealName}}</li>
              <li>尺寸：{{carDetail.carSizeRealName}}</li>
              <li>重量：{{carDetail.carWeightRealName}}</li>
              <li>接单区域：{{carDetail.prvRealName}}{{carDetail.cityRealName}}{{carDetail.cityAreaRealName}}</li>
            </ul>
          </el-col>
          <el-col :span="12">
            <ul class="i-list">
              <li>所属车队：{{carDetail.motorcadeCar}}</li>
              <li>申请时间：{{carDetail.applyDtme}}</li>
              <li>激活状态：{{carDetail.activeStatusName}}</li>
              <li>激活时间：{{carDetail.activeDtme}}</li>
              <li>审核状态：{{carDetail.checkStatusName}}</li>
              <li>审核时间：{{carDetail.checkDtme}}</li>
              <li>审核人：{{carDetail.checkPerson}}</li>
              <li>备注：{{carDetail.checkRemark}}</li>
            </ul>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col :span="6" class="tx-center">
                <img v-lazy="carDetail.drivingPicture" alt="驾驶证" class="cert-pic">
                <p>驾驶证</p>
              </el-col>
              <el-col :span="6" class="tx-center">
                <img v-lazy="carDetail.drivingLicense" alt="行驶证" class="cert-pic">
                <p>行驶证</p>
              </el-col>
              <el-col :span="6" class="tx-center">
                <img v-lazy="carDetail.identityCard" alt="身份证" class="cert-pic">
                <p>身份证</p>
              </el-col>
              <el-col :span="6" class="tx-center">
                <img v-lazy="carDetail.persomCarPicture" alt="人车合照" class="cert-pic">
                <p>人车合照</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog title="添加车辆" :visible.sync="addCarPopDialog">
        <el-form :inline="true" :model="addCarItem" label-position="left">
          <el-form-item label="驾驶员姓名">
            <el-input v-model="addCarItem.driverName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="驾驶员电话">
            <el-input v-model="addCarItem.driverPhone" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="驾驶员身份证">
            <el-input v-model="addCarItem.driverIdentityId" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="车牌号">
            <el-input v-model="addCarItem.carPlateNumber" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="车型">
            <el-select v-model="addCarItem.carType" clearable>
              <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆品牌">
            <el-select v-model="addCarItem.carBrand" clearable>
              <el-option v-for="(item, index) in carBrands" :key="index" :label="item.brandName" :value="item.brandId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆颜色">
            <el-select v-model="addCarItem.carColour" clearable>
              <el-option v-for="(item, index) in carColours" :key="index" :label="item.colourName" :value="item.colourId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆重量">
            <el-select v-model="addCarItem.carWeight" clearable>
              <el-option v-for="(item, index) in carWeight" :key="index" :label="item.weightName" :value="item.weightId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆尺寸">
            <el-select v-model="addCarItem.carSize" clearable>
              <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="item.sizeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属车队">
            <el-select v-model="addCarItem.motorcadeId" clearable>
              <el-option v-for="(item, index) in motorcadeNameList" :key="index" :label="item.motorcadeCar" :value="item.motorcadeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="addCarItem.applyDtme"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="addCarItem.checkStatus" clearable>
              <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核时间">
            <el-date-picker
              v-model="addCarItem.checkDtme"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="addCarItem.checkPerson" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addCarItem.checkRemark" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="接单区域">
            <el-select v-model="addCarItem.prvName" placeholder="请选择省">
              <el-option
                v-for="item in allPrv"
                :key="item.prvId"
                :label="item.prvName"
                :value="item.prvId">
              </el-option>
            </el-select>
            <el-select v-model="addCarItem.cityName" placeholder="请选择市">
              <el-option
                v-for="item in allCity"
                :key="item.cityId"
                :label="item.cityName"
                :value="item.cityId">
              </el-option>
            </el-select>
            <el-select v-model="addCarItem.cityAreaName" placeholder="请选择区">
              <el-option
                v-for="item in allCityArea"
                :key="item.cityAreaId"
                :label="item.cityAreaName"
                :value="item.cityAreaId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="6" class="tx-center">
              <el-upload
                :limit="1"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card">
                <img v-if="addCarItem.drivingPicture" :src="addCarItem.drivingPicture">
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">驾驶证</div>
              </el-upload>
            </el-col>
            <el-col :span="6" class="tx-center">
              <el-upload
                :limit="1"
                :show-file-list="false"
                action=""
                :auto-upload="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card">
                <img v-if="addCarItem.drivingLicense" :src="addCarItem.drivingLicense">
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">行驶证</div>
              </el-upload>
            </el-col>
            <el-col :span="6" class="tx-center">
              <el-upload
                :limit="1"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card">
                <img v-if="addCarItem.identityCard" :src="addCarItem.identityCard">
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">身份证</div>
              </el-upload>
            </el-col>
            <el-col :span="6" class="tx-center">
              <el-upload
                :limit="1"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card">
                <img v-if="addCarItem.persomCarPicture" :src="addCarItem.persomCarPicture">
                <i v-else class="el-icon-plus"></i>
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
      <el-dialog title="编辑车辆" :visible.sync="editCarPopDialog">
        <el-form :inline="true" :model="editCarItem" label-position="left">
          <el-form-item label="驾驶员姓名">
            <el-input v-model="editCarItem.driverName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="驾驶员电话">
            <el-input v-model="editCarItem.driverPhone" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="驾驶员身份证">
            <el-input v-model="editCarItem.driverIdentityId" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="车牌号">
            <el-input v-model="editCarItem.carPlateNumber" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="车型">
            <el-select v-model="editCarItem.carType" clearable>
              <el-option v-for="(item, index) in carTypes" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆品牌">
            <el-select v-model="editCarItem.carBrand" clearable>
              <el-option v-for="(item, index) in carBrands" :key="index" :label="item.brandName" :value="item.brandId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆颜色">
            <el-select v-model="editCarItem.carColour" clearable>
              <el-option v-for="(item, index) in carColours" :key="index" :label="item.colourName" :value="item.colourId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆重量">
            <el-select v-model="editCarItem.carWeight" clearable>
              <el-option v-for="(item, index) in carWeight" :key="index" :label="item.weightName" :value="item.weightId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆尺寸">
            <el-select v-model="editCarItem.carSize" clearable>
              <el-option v-for="(item, index) in carSizes" :key="index" :label="item.sizeName" :value="item.sizeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属车队">
            <el-select v-model="editCarItem.motorcadeId" clearable>
              <el-option v-for="(item, index) in motorcadeNameList" :key="index" :label="item.motorcadeCar" :value="item.motorcadeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="editCarItem.applyDtme"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="editCarItem.checkStatus" clearable>
              <el-option v-for="(item, index) in checkIdAndCheckStatus" :key="index" :label="item.checkStatusName" :value="item.checkStatusId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核时间">
            <el-date-picker
              v-model="editCarItem.checkDtme"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审核人">
            <el-input v-model="editCarItem.checkPerson" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editCarItem.checkRemark" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="接单区域">
            <el-select v-model="editCarItem.prvName" placeholder="请选择省">
              <el-option
                v-for="item in allPrv"
                :key="item.prvId"
                :label="item.prvName"
                :value="item.prvId">
              </el-option>
            </el-select>
            <el-select v-model="editCarItem.cityName" placeholder="请选择市">
              <el-option
                v-for="item in allCity"
                :key="item.cityId"
                :label="item.cityName"
                :value="item.cityId">
              </el-option>
            </el-select>
            <el-select v-model="editCarItem.cityAreaName" placeholder="请选择区">
              <el-option
                v-for="item in allCityArea"
                :key="item.cityAreaId"
                :label="item.cityAreaName"
                :value="item.cityAreaId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="6" class="tx-center">
              <el-upload
                :limit="1"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card">
                <img v-if="editCarItem.drivingPicture" v-lazy="editCarItem.drivingPicture">
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">驾驶证</div>
              </el-upload>
            </el-col>
            <el-col :span="6" class="tx-center">
              <el-upload
                :limit="1"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card">
                <img v-if="editCarItem.drivingLicense" v-lazy="editCarItem.drivingLicense">
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">行驶证</div>
              </el-upload>
            </el-col>
            <el-col :span="6" class="tx-center">
              <el-upload
                :limit="1"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card">
                <img v-if="editCarItem.identityCard" v-lazy="editCarItem.identityCard">
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">身份证</div>
              </el-upload>
            </el-col>
            <el-col :span="6" class="tx-center">
              <el-upload
                :limit="1"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card">
                <img v-if="editCarItem.persomCarPicture" v-lazy="editCarItem.persomCarPicture">
                <i v-else class="el-icon-plus"></i>
                <div slot="tip" style="text-align: center" class="el-upload__tip">人车合照</div>
              </el-upload>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCarPopDialog = false">取 消</el-button>
          <el-button type="primary" @click="onEditCarConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaList } from '@/api/schedule'
  import { getCarTypeList } from '@/api/order'
  import { getAllCar, deleteCar, getMotorcadeList, addCar, updateCar, getAllCarBand, getAllCarColour, getAllCarType, getCarDetail, getCarWeightList, getCarSizeList } from '@/api/truck'
  import { getCheckStatus, getActiveStatus, getAllCity, getAllCityArea, getAllPrv, getAllTown } from '@/api/dictionary'
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
          checkStatus: '',
          carPlateNumberSearchKey: '',
          driverNameSearchKey: '',
          driverPhoneSearchKey: '',
          motorcadeId: ''
        },
        addCarItem: {
          activeDtme: '',
          activeStatus: '',
          applyDtme: '',
          carBrand: '',
          carColour: '',
          carPlateNumber: '',
          carType: '',
          carWeight: '',
          carSize: '',
          checkDtme: '',
          checkPerson: '',
          checkRemark: '',
          checkStatus: '',
          cityAreaName: '',
          cityName: '',
          customerNumId: '',
          driverIdentityId: '',
          driverName: '',
          driverPhone: '',
          drivingLicense: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          drivingPicture: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          identityCard: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          motorcadeId: '',
          persomCarPicture: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          prvName: ''
        },
        editCarItem: {
          activeDtme: '',
          activeStatus: '',
          applyDtme: '',
          carBrand: '',
          carColour: '',
          carWeight: '',
          carSize: '',
          carPlateNumber: '',
          carType: '',
          checkDtme: '',
          checkPerson: '',
          checkRemark: '',
          checkStatus: '',
          cityAreaName: '',
          cityName: '',
          customerNumId: '',
          driverId: '',
          driverIdentityId: '',
          driverName: '',
          driverPhone: '',
          drivingLicense: '',
          drivingPicture: '',
          identityCard: '',
          motorcadeId: '',
          persomCarPicture: '',
          prvName: ''
        },
        tableData: [],
        searching: false,
        detailCarDialog: false,
        addCarPopDialog: false,
        editCarPopDialog: false,
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
        checkIdAndCheckStatus: [],
        activeStatusModels: [],
        allPrv: [],
        allCity: [],
        allCityArea: [],
        allTown: [],
        carBrands: [],
        carColours: [],
        carTypes: [],
        carWeight: [],
        carSizes: [],
        carDetail: {}
      }
    },
    computed: {
      totalPage () {
        return this.tableData.length
      },
      tableInlineData () {
        this.tableData.forEach((item) => {
          item.district = `${item.prvRealName}/${item.cityRealName}/${item.cityAreaRealName}`
        })
        return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      }
    },
    created () {
      this.onSearch()
      this._getRouterAliaList({
        customerNumId: this.customerNumId
      })
      this._getCarTypeList({
        customerNumId: this.customerNumId
      })
      // 获取字典接口数据
      this._getCheckStatus({
        customerNumId: this.customerNumId
      })
      this._getActiveStatus({
        customerNumId: this.customerNumId
      })
      this._getMotorcadeList({
        franchiseeid: ''
      })
      this._getAllCarBand({
        current: 1,
        pageSize: 200,
        customerNumId: this.customerNumId
      })
      this._getCarWeightList({
        customerNumId: this.customerNumId
      })
      this._getAllCarColour({
        current: 1,
        pageSize: 200,
        customerNumId: this.customerNumId
      })
      this._getCarSizeList({
        customerNumId: this.customerNumId
      })
      // 省市区联动数据
      this._getAllPrv({
        current: 1,
        customerNumId: this.customerNumId,
        pageSize: 200
      })
    },
    watch: {
      'editCarItem.prvName' () {
        // this.editCustomerItem.cityName = ''
        // this.editCustomerItem.cityAreaName = ''
        this._getAllCity({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.editCarItem.prvName
        })
      },
      'addCarItem.prvName' () {
        // this.addCustomerItem.cityName = ''
        // this.addCustomerItem.cityAreaName = ''
        this._getAllCity({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.addCarItem.prvName
        })
      },
      'editCarItem.cityName' () {
        // this.editCustomerItem.cityAreaName = ''
        this._getAllCityArea({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.editCarItem.prvName,
          cityId: this.editCarItem.cityName
        })
      },
      'addCarItem.cityName' () {
        // this.addCustomerItem.cityAreaName = ''
        this._getAllCityArea({
          current: 1,
          pageSize: 200,
          customerNumId: this.customerNumId,
          prvId: this.addCarItem.prvName,
          cityId: this.addCarItem.cityName
        })
      }
    },
    methods: {
      _getCarDetail (params) {
        getCarDetail(params).then(res => {
          if (res.code === 0) {
            // 清空数据
            this.carDetail = res.car
            this.editCarItem = this.carDetail
            // console.log(this.editCarItem)
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
      _getActiveStatus (params) {
        getActiveStatus(params).then(res => {
          if (res.code === 0) {
            this.activeStatusModels = res.activeStatusModels
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
      _getMotorcadeList (params) {
        getMotorcadeList(params).then(res => {
          if (res.code === 0) {
            this.motorcadeNameList = res.motorcadeNameList
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllCarType (params) {
        getAllCarType(params).then(res => {
          if (res.code === 0) {
            this.carTypes = res.carTypes
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllCarBand (params) {
        getAllCarBand(params).then(res => {
          if (res.code === 0) {
            this.carBrands = res.carBrands
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getCarWeightList (params) {
        getCarWeightList(params).then(res => {
          if (res.code === 0) {
            this.carWeight = res.carWeights
          }
        }).catch(err => {
          console.log(err)
        })
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
      _getAllCarColour (params) {
        getAllCarColour(params).then(res => {
          if (res.code === 0) {
            this.carColours = res.carColours
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _addCar (params) {
        addCar(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.addCarPopDialog = false
            this.onSearch()
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
      _updateCar (params) {
        console.log(params)
        updateCar(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.editCarPopDialog = false
            this.onSearch()
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
        this.addCarItem.customerNumId = this.customerNumId
        this._addCar(this.addCarItem)
      },
      onEditCar (index, row) {
        console.log(index, row)
        this.editCarItem.drivingLicense = ''
        this.editCarItem.drivingPicture = ''
        this.editCarItem.identityCard = ''
        this.editCarItem.persomCarPicture = ''
        this._getCarDetail({
          carId: row.carId,
          customerNumId: this.customerNumId
        })
        this.editCarPopDialog = true
      },
      onEditCarConfirm () {
        this.editCarItem.customerNumId = this.customerNumId
        this._updateCar(this.editCarItem)
      },
      onDetailCar (index, row) {
        this.detailCarDialog = true
        this._getCarDetail({
          carId: row.carId,
          customerNumId: this.customerNumId
        })
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
      },
      handleAvatarSuccess (res, file) {
        this.addCarItem.persomCarPicture = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      }
    }
  }
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
    & li{
      padding: 5px 15px;
    }
  }
  .el-dialog__body {
    text-align: center;
  }
  .tx-center {
    padding: 20px 0;
    text-align: center;
  }
  .cert-pic {
    width: 148px;
    outline: 1px #ccc dashed;
  }
  .el-upload.el-upload--picture-card > img {
    width: 100%;
  }
}
</style>
