<template>
  <div class="login-page">
    <div class="layer bg" id="login"></div>
    <div class="layer flex-center">
      <!-- logo部分 -->
      <div class="logo-group">
        <img :src="`${$assetsPublicPath}static/image/icon/500/d2admin.png`" alt="logo">
      </div>
      <!-- 表单部分 -->
      <div class="form-group">
        <el-card>
          <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin">
            <el-form-item  prop="username">
              <el-input type="text" v-model="formLogin.username" placeholder="用户名">
                <i slot="prepend" class="fa fa-user-circle-o"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="formLogin.password" placeholder="密码">
                <i slot="prepend" class="fa fa-keyboard-o"></i>
              </el-input>
            </el-form-item>
            <el-button @click="submit" type="primary" class="button-login">登录</el-button>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
require('particles.js')
// 配置地址
// https://vincentgarreau.com/particles.js/#default
import config from './config/default'
import Cookies from 'js-cookie'
import { mapMutations } from 'vuex'
import { loginSystem } from '@/api/login'

export default {
  data () {
    return {
      formLogin: {
        username: 'admin123',
        password: 'admin123'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 初始化例子插件
    particlesJS('login', config)
  },
  methods: {
    ...mapMutations([
      'd2adminUsernameSet'
    ]),
    _loginSystem (params) {
      loginSystem(params).then(res => {
        // cookie 60分钟的有效期
        const expireTime = new Date(new Date().getTime() + 60 * 60 * 1000)
        const setting = {
          expires: expireTime
        }
        // 设置 cookie
        Cookies.set('token', res.sid, setting)
        Cookies.set('uuid', res.customerNumId, setting)
        Cookies.set('__user__customernumid', res.customerNumId, setting)
        Cookies.set('__user__sid', res.sid, setting)
        Cookies.set('__user__name', this.formLogin.username, setting)

        // Cookies.set('token', res.sid)
        // Cookies.set('uuid', res.customerNumId)
        // Cookies.set('__user__customernumid', res.customerNumId)
        // Cookies.set('__user__sid', res.sid)
        // Cookies.set('__user__name', this.formLogin.username)

        // 设置 vuex
        this.d2adminUsernameSet(this.formLogin.username)
        // 跳转路由
        this.$router.push({
          name: 'index'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 提交登陆信息
    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 入参
          const params = {
            customerAccount: this.formLogin.username,
            customerPassword: this.formLogin.password
          }
          // 登录
          this._loginSystem(params)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import './style.scss';
</style>

