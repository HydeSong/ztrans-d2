<template>
  <el-dropdown class="d2-mr">
    <span class="btn-text">你好 {{username}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff"><d2-icon name="power-off"/> 注销</el-dropdown-item>
      <el-dropdown-item><d2-icon name="user-circle-o"/> 个人中心</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
// 插件
import Cookies from 'js-cookie'
// import { mapState, mapMutations } from 'vuex'
import { mapMutations } from 'vuex'
import { cancelLoginSystem } from '@/api/login'

export default {
  data () {
    return {
      sid: Cookies.get('__user__sid'),
      username: Cookies.get('__user__name')
    }
  },
  // computed: {
  //   ...mapState({
  //     username: state => state.d2admin.username
  //   })
  // },
  methods: {
    ...mapMutations([
      'd2adminDbRemoveByUuid'
    ]),
    _cancelLoginSystem (params) {
      console.log(params)
      cancelLoginSystem(params).then(res => {
        console.log(res)
        if (res.status === 200) {
          const code = res.data.code
          switch (code) {
            case 0:
              // 删除用户名
              this.d2adminDbRemoveByUuid({
                key: 'username',
                emptyValue: ''
              })
              // 删除cookie
              Cookies.remove('token')
              Cookies.remove('uuid')
              Cookies.remove('__user__sid')
              Cookies.remove('__user__customernumid')
              // 跳转路由
              this.$router.push({
                name: 'login'
              })
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
    logOff () {
      this.$confirm('注销此账户吗?', '注销', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          sid: this.sid
        }
        this._cancelLoginSystem(params)
      }).catch(() => {
        // 取消了注销
      })
    }
  }
}
</script>
