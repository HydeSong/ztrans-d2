<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="searchItem" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="searchItem.routerDetailAliaSearchKey" placeholder="线路别名">
            <el-option v-for="(item, index) in routerDetail" :key="index" :label="item.routerAlia" :value="item.series"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchItem.employeeNameSearchKey" placeholder="调度人姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" icon="el-icon-search" :loading="searching">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAdd" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        height="480">
        <el-table-column
          fixed
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          prop="road"
          label="线路别名">
        </el-table-column>
        <el-table-column
          fixed
          prop="name"
          label="调度人姓名">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaList, getAllRouterAndEmployee, deleteRouterAndEmployee } from '@/api/schedule'
  import Cookies from 'js-cookie'
  export default {
    data () {
      return {
        customerNumId: Cookies.get('__user__customernumid'),
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
        routerDetail: [{
          routerAlia: '通往天堂之路1',
          series: 123451
        }, {
          routerAlia: '通往天堂之路2',
          series: 123452
        }, {
          routerAlia: '通往天堂之路3',
          series: 123453
        }, {
          routerAlia: '通往天堂之路4',
          series: 123454
        }, {
          routerAlia: '通往天堂之路5',
          series: 123455
        }, {
          routerAlia: '通往天堂之路6',
          series: 123456
        }, {
          routerAlia: '通往天堂之路7',
          series: 123457
        }, {
          routerAlia: '通往天堂之路8',
          series: 123458
        }, {
          routerAlia: '通往天堂之路9',
          series: 123459
        }, {
          routerAlia: '通往天堂之路0',
          series: 123450
        }, {
          routerAlia: '通往天堂之路01',
          series: 1234501
        }, {
          routerAlia: '通往天堂之路02',
          series: 1234502
        }],
        searchItem: {
          routerDetailAliaSearchKey: '',
          employeeNameSearchKey: ''
        },
        tableData: [{
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }, {
          road: '通往天堂之路',
          name: '王小虎'
        }],
        total: 400,
        searching: false
      }
    },
    created () {
      this._getRouterAliaList({customerNumId: this.customerNumId})
    },
    methods: {
      _deleteRouterAndEmployee (params) {
        deleteRouterAndEmployee(params).then(res => {
          console.log(res)
          if (res.status === 200) {
            const code = res.data.code
            switch (code) {
              case 0:
                this.tableData = res.data.employeeRouterModel
                this.total = res.data.total
                break
              case 401:
                console.log(code)
                break
              case 403:
                console.log(code)
                break
              case 404:
                console.log(code)
                break
              case -1:
                console.log(code)
                break
              default:
                console.log(code)
                break
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getAllRouterAndEmployee (params) {
        this.searching = true
        getAllRouterAndEmployee(params).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.searching = false
            const code = res.data.code
            switch (code) {
              case 0:
                this.tableData = res.data.employeeRouterModel
                this.total = res.data.total
                break
              case 401:
                console.log(code)
                break
              case 403:
                console.log(code)
                break
              case 404:
                console.log(code)
                break
              case -1:
                console.log(code)
                break
              default:
                console.log(code)
                break
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      _getRouterAliaList (params) {
        getRouterAliaList(params).then(res => {
          console.log(res)
          if (res.status === 200) {
            const code = res.data.code
            switch (code) {
              case 0:
                this.routerDetail = res.data.routerDetail
                break
              case 401:
                console.log(code)
                break
              case 403:
                console.log(code)
                break
              case 404:
                console.log(code)
                break
              case -1:
                console.log(code)
                break
              default:
                console.log(code)
                break
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      onSearch () {
        console.log('Search!')
        const params = {
          'current': 1,
          'customerNumId': 1,
          'employeeNameSearchKey': '大型车',
          'pageSize': 1,
          'routerDetailAliaSearchKey': '1号路线'
        }
        this._getAllRouterAndEmployee(params)
      },
      onAdd () {
        console.log('add!')
      },
      handleClick (row) {
        console.log(row)
        this._deleteRouterAndEmployee(row)
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/assets/style/public.scss';
  .page {
    .block {
      padding: 10px 0;
      text-align: right;
    }
  }
</style>
