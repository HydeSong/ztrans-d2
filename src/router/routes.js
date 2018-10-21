const meta = {
  requiresAuth: true
}
/**
 * 在主框架内显示
 */
const frameIn = [
  // 首页
  {
    path: '/',
    redirect: {
      name: 'index'
    },
    component: () => import ('@/components/core/d2-layout-main'),
    children: [
      {
        path: 'index',
        name: 'index',
        meta,
        component: () => import ('@/pages/core/index')
      }
    ]
  }, {
    path: '/core/setting',
    name: 'core-setting',
    meta,
    redirect: {
      name: 'core-setting-index'
    },
    component: () => import ('@/components/core/d2-layout-main'),
    children: (pre => [
      {
        path: 'index',
        name: `${pre}index`,
        component: () => import ('@/pages/core/setting/index'),
        meta: {
          ...meta,
          title: '设置首页'
        }
      }, {
        path: 'releases',
        name: `${pre}releases`,
        component: () => import ('@/pages/core/setting/releases'),
        meta: {
          ...meta,
          title: '版本'
        }
      }
    ])('core-setting-')
  }, {
    path: '/schedule',
    name: 'schedule',
    meta,
    redirect: {
      name: 'schedule-employee'
    },
    component: () => import ('@/components/core/d2-layout-main'),
    children: (pre => [
      {
        path: 'employee',
        name: `${pre}employee`,
        component: () => import ('@/pages/schedule/employee'),
        meta: {
          ...meta,
          title: '调度人'
        }
      }, {
        path: 'car',
        name: `${pre}car`,
        component: () => import ('@/pages/schedule/car'),
        meta: {
          ...meta,
          title: '车辆'
        }
      }
    ])('schedule-')
  }, {
    path: '/order',
    name: 'order',
    meta,
    redirect: {
      name: 'order-car'
    },
    component: () => import ('@/components/core/d2-layout-main'),
    children: (pre => [
      {
        path: 'car',
        name: `${pre}car`,
        component: () => import ('@/pages/order/car'),
        meta: {
          ...meta,
          title: '指派车辆'
        }
      }, {
        path: 'order',
        name: `${pre}order`,
        component: () => import ('@/pages/order/order'),
        meta: {
          ...meta,
          title: '订单'
        }
      }
    ])('order-')
  }, {
    path: '/customer',
    name: 'customer',
    meta,
    redirect: {
      name: 'customer-list'
    },
    component: () => import ('@/components/core/d2-layout-main'),
    children: (pre => [
      {
        path: 'list',
        name: `${pre}list`,
        component: () => import ('@/pages/customer/list'),
        meta: {
          ...meta,
          title: '客户列表'
        }
      }
    ])('customer-')
  }, {
    path: '/truck',
    name: 'truck',
    meta,
    redirect: {
      name: 'truck-list'
    },
    component: () => import ('@/components/core/d2-layout-main'),
    children: (pre => [
      {
        path: 'list',
        name: `${pre}list`,
        component: () => import ('@/pages/truck/list'),
        meta: {
          ...meta,
          title: '车辆管理'
        }
      }
    ])('truck-')
  }, {
    path: '/price',
    name: 'price',
    meta,
    redirect: {
      name: 'price-road'
    },
    component: () => import ('@/components/core/d2-layout-main'),
    children: (pre => [
      {
        path: 'road',
        name: `${pre}road`,
        component: () => import ('@/pages/price/road'),
        meta: {
          ...meta,
          title: '线路报价'
        }
      }, {
        path: 'local',
        name: `${pre}local`,
        component: () => import ('@/pages/price/local'),
        meta: {
          ...meta,
          title: '同城报价'
        }
      }, {
        path: 'customer',
        name: `${pre}customer`,
        component: () => import ('@/pages/price/customer'),
        meta: {
          ...meta,
          title: '客户报价'
        }
      }
    ])('price-')
  }, {
    path: '/orderprice',
    name: 'orderprice',
    meta,
    redirect: {
      name: 'orderprice-list'
    },
    component: () => import ('@/components/core/d2-layout-main'),
    children: (pre => [
      {
        path: 'list',
        name: `${pre}list`,
        component: () => import ('@/pages/orderprice/list'),
        meta: {
          ...meta,
          title: '订单费用'
        }
      }
    ])('orderprice-')
  }, {
    path: '/createorder',
    name: 'createorder',
    meta,
    redirect: {
      name: 'createorder-create'
    },
    component: () => import ('@/components/core/d2-layout-main'),
    children: (pre => [
      {
        path: 'create',
        name: `${pre}create`,
        component: () => import ('@/pages/createorder/create'),
        meta: {
          ...meta,
          title: '后台下单'
        }
      }
    ])('createorder-')
  }
  // {   path: '/demo/business',   name: 'demo-business',   meta,   redirect: {
  // name: 'demo-business-index' },   children: (pre => [     { path: 'index',
  // name: `${pre}index`, component: () => import('@/pages/demo/business/index'),
  // meta: { ...meta, title: '示例首页' } },     { path: 'table/1', name:
  // `${pre}table-1`, component: () => import('@/pages/demo/business/table/1'),
  // meta: { ...meta, title: '表格 1' } }   ])('demo-business-') }
]

/**
 * 错误页面
 */
const errorPage = [// 404
  {
    path: '*',
    name: '404',
    component: () => import ('@/pages/core/404')
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [// 登陆
  {
    path: '/login',
    name: 'login',
    component: () => import ('@/pages/core/login')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default[...frameIn,
  ...frameOut,
  ...errorPage]
