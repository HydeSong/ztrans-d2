<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem">
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
          <el-button type="primary" @click="onAddRoadPrice" icon="el-icon-plus">新增</el-button>
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
            <el-button @click="onEditRoadPrice(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="onViewRoadPrice(scope.$index, scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="onDeleteRoadPrice(scope.$index, scope.row)" type="text" size="small">删除</el-button>
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
      <el-dialog title="查看线路报价" :visible.sync="detailDialog">
        <el-table
          :data="tablePopData"
          :span-method="objectSpanMethod"
          highlight-current-row
          style="width: 100%"
          height="400">
          <el-table-column
            fixed
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="carTypeRealName"
            label="车型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="routerCustomerTypeTxt"
            label="报价类型">
          </el-table-column>
          <el-table-column
            prop="initPriceTxt"
            label="起步价"
            width="160">
          </el-table-column>
          <el-table-column
            prop="overstepPriceTxt"
            label="超过价格"
            width="160">
          </el-table-column>
          <el-table-column
            prop="franchiseeProportionTxt"
            label="提成比例">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="onDeletePriceDetail(scope.$index, scope.row)" type="text" size="small">删除</el-button>
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
      <el-dialog title="编辑线路报价" :visible.sync="editDialog">
        <!--:span-method="objectSpanMethod"-->
        <div class="block" style="text-align: left">
          线路设置
        </div>  
        <div class="block" style="text-align: center">
          <el-form :inline="true" :model="editItem">
            <el-form-item label="线路编号">
              <el-input v-model="editItem.routerNumberSearchKey" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="线路别名">
              <el-input v-model="editItem.routerNumberSearchKey" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="起始点">
              <el-cascader
                :options="options"
                change-on-select
              ></el-cascader>
            </el-form-item>
            <el-form-item label="目的地">
              <el-cascader
                :options="options"
                change-on-select
              ></el-cascader>
            </el-form-item>
          </el-form>
        </div>
        <div class="block" style="text-align: left">
          报价设置
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
            prop="carTypeRealName"
            label="车型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="routerCustomerType"
            label="报价类型">
          </el-table-column>
          <el-table-column
            prop="initPrice"
            label="起步价"
            width="160">
          </el-table-column>
          <el-table-column
            prop="overstepPrice"
            label="超过价格"
            width="160">
          </el-table-column>
          <el-table-column
            prop="franchiseeProportion"
            label="提成比例">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="onAssignConfirm(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </el-dialog>
      <el-dialog title="新增线路报价" :visible.sync="addDialog">
        <!--:span-method="objectSpanMethod"-->
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
            prop="carTypeRealName"
            label="车型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="routerCustomerType"
            label="报价类型">
          </el-table-column>
          <el-table-column
            prop="initPrice"
            label="起步价"
            width="160">
          </el-table-column>
          <el-table-column
            prop="overstepPrice"
            label="超过价格"
            width="160">
          </el-table-column>
          <el-table-column
            prop="franchiseeProportion"
            label="提成比例">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="onAssignConfirm(scope.row)" type="text" size="small">删除</el-button>
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
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaList } from '@/api/schedule'
  import { getAllRouterPriceByRouterId, deleteRouterByRouterId, deleteRouterPrice, updateBatchRouterPrice } from '@/api/price'
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
        routerPriceList: [],
        searchItem: {
          routerDetailAliaSearchKey: '',
          routerDetailSeries: '',
          routerNumberSearchKey: '',
          routerType: ''
        },
        editItem: {
          routerNumberSearchKey: ''
        },
        tableData: [],
        searching: false,
        detailDialog: false,
        editDialog: false,
        addDialog: false,
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
        options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }]
      }
    },
    computed: {
      totalPage () {
        return this.tableData.length
      },
      addTotalPage () {
        return this.routerPriceList.length
      },
      tableInlineData () {
        return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      },
      tablePopData () {
        this.routerPriceList.forEach((item) => {
          item.routerCustomerTypeTxt = item.routerCustomerType === 0 ? '客户报价' : '司机报价'
          item.franchiseeProportionTxt = `${item.franchiseeProportion}%`
          item.overstepPriceTxt = `${item.overstepPrice}元/公里`
          item.initPriceTxt = `${item.initPrice}元/${item.initDistance}公里`
        })
        return this.routerPriceList
      }
    },
    created () {
      this._getRouterAliaList({
        customerNumId: this.customerNumId
      })
      this.onSearch()
    },
    methods: {
      objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      _getAllRouterPriceByRouterId (params) {
        getAllRouterPriceByRouterId(params).then(res => {
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
      _deleteRouterPrice (params, index) {
        deleteRouterPrice(params).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            let idx = ''
            if (index % 2 === 0) {
              idx = index - 1
            } else {
              idx = index + 1
            }
            this.tablePopData.splice(index, 1)
            this.tablePopData.splice(idx, 1)
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
      onSearch () {
        this._getAllRouterPriceByRouterId({
          current: this.currentPage,
          pageSize: this.pageSize,
          customerNumId: this.customerNumId,
          routerDetailAliaSearchKey: this.searchItem.routerDetailAliaSearchKey,
          routerDetailSeries: this.searchItem.routerDetailSeries,
          routerNumberSearchKey: this.searchItem.routerNumberSearchKey,
          routerType: this.searchItem.routerType
        })
      },
      onAddRoadPrice () {
        this.addDialog = true
      },
      onSearchPop () {
        this._selectDriver({
          current: this.curPage,
          pageSize: this.pgSize,
          customerNumId: this.customerNumId,
          appointmentDate: this.searchItemPop.appointmentDate,
          carPlateNumberSearchKey: this.searchItemPop.carPlateNumberSearchKey,
          carTypeSeries: this.searchItemPop.carTypeSeries,
          driverNameSearchKey: this.searchItemPop.driverNameSearchKey,
          routerDetailSeries: this.searchItemPop.routerDetailSeries
        })
      },
      onEditRoadPrice (index, row) {
        this.editDialog = true
      },
      onViewRoadPrice (index, row) {
        this.detailDialog = true
        this.routerPriceList = row.routerPriceList
        console.log(row)
      },
      onDeleteRoadPrice (index, row) {
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
      onDeletePriceDetail (index, row) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._deleteRouterPrice({
            customerNumId: this.customerNumId,
            routerPriceId: row.routerPriceId
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
  }
</style>
