const setting = {
  path: '/core/setting',
  title: '设置',
  icon: 'cog',
  children: (pre => [
    { path: `${pre}index`, title: '设置首页', icon: 'home' },
    { path: `${pre}releases`, title: '版本', icon: 'info-circle' }
  ])('/core/setting/')
}

const schedule = {
  path: '/schedule',
  title: '调度中心',
  icon: 'briefcase',
  children: (pre => [
    { path: `${pre}employee`, title: '调度人', icon: 'user' },
    { path: `${pre}car`, title: '车辆', icon: 'car' }
  ])('/schedule/')
}

// 菜单 侧边栏
export const side = [
  schedule,
  setting
]

// 菜单 顶栏
export default [
  {
    path: '/index',
    title: '首页',
    icon: 'home'
  },
  schedule,
  setting
]
