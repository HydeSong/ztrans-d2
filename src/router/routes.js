const meta = { requiresAuth: true }

/**
 * 在主框架内显示
 */
const frameIn = [
  // 首页
  {
    path: '/',
    redirect: { name: 'index' },
    component: () => import('@/components/core/d2-layout-main'),
    children: [
      {
        path: 'index',
        name: 'index',
        meta,
        component: () => import('@/pages/core/index')
      }
    ]
  },
  {
    path: '/core/setting',
    name: 'core-setting',
    meta,
    redirect: { name: 'core-setting-index' },
    component: () => import('@/components/core/d2-layout-main'),
    children: (pre => [
      { path: 'index', name: `${pre}index`, component: () => import('@/pages/core/setting/index'), meta: { ...meta, title: '设置首页' } },
      { path: 'releases', name: `${pre}releases`, component: () => import('@/pages/core/setting/releases'), meta: { ...meta, title: '版本' } }
    ])('core-setting-')
  },
  {
    path: '/schedule',
    name: 'schedule',
    meta,
    redirect: { name: 'schedule-employee' },
    component: () => import('@/components/core/d2-layout-main'),
    children: (pre => [
      { path: 'employee', name: `${pre}employee`, component: () => import('@/pages/schedule/employee'), meta: { ...meta, title: '调度人' } },
      { path: 'car', name: `${pre}car`, component: () => import('@/pages/schedule/car'), meta: { ...meta, title: '车辆' } }
    ])('schedule-')
  },
  {
    path: '/order',
    name: 'order',
    meta,
    redirect: { name: 'order-car' },
    component: () => import('@/components/core/d2-layout-main'),
    children: (pre => [
      { path: 'car', name: `${pre}car`, component: () => import('@/pages/order/car'), meta: { ...meta, title: '指派车辆' } }
    ])('order-')
  },
  {
    path: '/customer',
    name: 'customer',
    meta,
    redirect: { name: 'customer-list' },
    component: () => import('@/components/core/d2-layout-main'),
    children: (pre => [
      { path: 'list', name: `${pre}list`, component: () => import('@/pages/customer/list'), meta: { ...meta, title: '客户列表' } }
    ])('customer-')
  },
  {
    path: '/truck',
    name: 'truck',
    meta,
    redirect: { name: 'truck-list' },
    component: () => import('@/components/core/d2-layout-main'),
    children: (pre => [
      { path: 'list', name: `${pre}list`, component: () => import('@/pages/truck/list'), meta: { ...meta, title: '车辆列表' } }
    ])('truck-')
  },
  {
    path: '/price',
    name: 'price',
    meta,
    redirect: { name: 'price-list' },
    component: () => import('@/components/core/d2-layout-main'),
    children: (pre => [
      { path: 'list', name: `${pre}list`, component: () => import('@/pages/price/list'), meta: { ...meta, title: '报价列表' } }
    ])('price-')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  // 404
  {
    path: '*',
    name: '404',
    component: () => import('@/pages/core/404')
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登陆
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/core/login')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
