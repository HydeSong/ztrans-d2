// const setting = {
//   path: '/core/setting',
//   title: '设置',
//   icon: 'cog',
//   children: (pre => [
//     { path: `${pre}index`, title: '设置首页', icon: 'home' },
//     { path: `${pre}releases`, title: '版本', icon: 'info-circle' }
//   ])('/core/setting/')
// }

const schedule = {
  path: '/schedule',
  title: '调度管理',
  icon: 'briefcase',
  children: (pre => [
    { path: `${pre}employee`, title: '调度人', icon: 'user' },
    { path: `${pre}car`, title: '车辆', icon: 'truck' }
  ])('/schedule/')
}

const order = {
  path: '/order',
  title: '订单管理',
  icon: 'file-text',
  children: (pre => [
    { path: `${pre}car`, title: '指派车辆', icon: 'truck' },
    { path: `${pre}order`, title: '订单', icon: 'file-text' }
  ])('/order/')
}

const customer = {
  path: '/customer',
  title: '客户管理',
  icon: 'address-book',
  children: (pre => [
    { path: `${pre}list`, title: '客户列表', icon: 'list-ol' }
  ])('/customer/')
}

const truck = {
  path: '/truck',
  title: '车辆管理',
  icon: 'truck',
  children: (pre => [
    { path: `${pre}list`, title: '车辆列表', icon: 'list-ol' }
  ])('/truck/')
}

const price = {
  path: '/price',
  title: '报价管理',
  icon: 'dollar',
  children: (pre => [
    { path: `${pre}list`, title: '报价列表', icon: 'list-ol' }
  ])('/price/')
}

// 菜单 侧边栏
export const side = [
  schedule,
  order,
  customer,
  truck,
  price
]

// 菜单 顶栏
export default [
  {
    path: '/index',
    title: '首页',
    icon: 'home'
  },
  schedule,
  order,
  customer,
  truck,
  price
]
