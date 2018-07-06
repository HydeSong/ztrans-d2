<template>
  <d2-container type="full" class="page">
    <template>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.region" placeholder="线路别名">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.user" placeholder="调度人姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-plus">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        height="480">
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
          :total="400">
        </el-pagination>
      </div>
    </template>
  </d2-container>
</template>

<script>
  import { getRouterAliaList } from '@/api/schedule'
  export default {
    data () {
      return {
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
        formInline: {
          user: '',
          region: ''
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
        }]
      }
    },
    created () {
      this._getRouterAliaList({})
    },
    methods: {
      _getRouterAliaList (params) {
        getRouterAliaList(params).then(res => {
          console.log(res)
          if (res.status === 200) {
            const code = res.data.code
            switch (code) {
              case 0:

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
      onSubmit () {
        console.log('submit!')
      },
      handleClick (row) {
        console.log(row)
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
