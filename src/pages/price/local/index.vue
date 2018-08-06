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
          <el-button type="primary" icon="el-icon-plus">新增</el-button>
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
                  <el-button type="text" size="small" @click="onDeleteLocalDetail(scope.$index, scope.row)" v-if="scope.$index % 2 === 1">删除</el-button>
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
            <el-button type="text" size="small">编辑</el-button>
            <el-button @click="onDeleteLocalPrice(scope.$index, scope.row)" type="text" size="small">删除</el-button>
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
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaList } from '@/api/schedule'
  import { getAllRouterPriceByRouterId, deleteRouterByRouterId, deleteRouterPrice } from '@/api/price'
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
          routerDetailAliaSearchKey: '',
          routerDetailSeries: '',
          routerNumberSearchKey: '',
          routerType: 1
        },
        tableData: [],
        searching: false
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
      this.onSearch()
    },
    methods: {
      routerCustomerTypeFormat (val) {
        return val.routerCustomerType === 0 ? '客户报价' : '司机报价'
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
      _getAllRouterPriceByRouterId (params) {
        getAllRouterPriceByRouterId(params).then(res => {
          if (res.code === 0) {
            this.tableData = res.allRouterPriceGetModels
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
      onAdd () {
      },
      onDeleteLocalPrice (index, row) {
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
      onDeleteLocalDetail (index, row) {
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
      _deleteRouterPrice (params, index) {
        deleteRouterPrice(params).then(res => {
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
