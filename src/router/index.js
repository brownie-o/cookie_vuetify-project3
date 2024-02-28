// Composables
import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    // 前台畫面的layout 
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/front/HomeView.vue'),
        meta: {
          title: '餅乾計畫',
          login: false,
          admin: false
        }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/front/LoginView.vue'),
        meta: {
          title: '餅乾計畫 | 登入',
          login: false,
          admin: false
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/front/RegisterView.vue'),
        meta: {
          title: '餅乾計畫 | 註冊',
          login: false,
          admin: false
        }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/front/ProfileView.vue'),
        meta: {
          title: '餅乾計畫 | 個人資料',
          login: true,
          admin: false
        }
      },
      {
        path: 'edit',
        name: 'EditProfile',
        component: () => import('@/views/front/EditProfileView.vue'),
        meta: {
          title: '餅乾計畫 | 修改資料',
          login: true,
          admin: false
        }
      },
      {
        path: 'main',
        name: 'Main',
        component: () => import('@/views/front/MainView.vue'),
        meta: {
          title: '餅乾計畫 | 主頁',
          login: true,
          admin: false
        }
      },
      {
        path: 'friends',
        name: 'Friends',
        component: () => import('@/views/front/FriendsView.vue'),
        meta: {
          title: '餅乾計畫 | 好友列表',
          login: true,
          admin: false
        }
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: () => import('@/views/admin/HomeView.vue'),
        meta: {
          title: '餅乾計畫 | 管理',
          login: true,
          admin: true
        }
      },
      {
        path: 'users',
        name: 'UsersManagement',
        component: () => import('@/views/admin/UsersManagement.vue'),
        meta: {
          title: '餅乾計畫 | 會員管理',
          login: true,
          admin: true
        }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

router.beforeEach(async (to, from, next) => {
  const user = useUserStore()

  if (from === START_LOCATION) {
    await user.getProfile()
  }
  // 如果有登入 且 要去的頁面是登入或註冊
  if (user.isLogin && ['/register', '/login'].includes(to.path)) {
    next('/')
  } else if (to.meta.login && !user.isLogin) {
    // 要去的頁面需要登入 但沒登入
    next('/login')
  } else if (to.meta.admin && !user.isAdmin) {
    next('/')
  } else {
    // 不重新導向
    next()
  }
})

export default router
