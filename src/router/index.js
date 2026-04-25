import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AdminAnalytics from '../views/AdminAnalytics.vue'
import KnowledgeBase from '../views/KnowledgeBase.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: AdminAnalytics,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/help',
      name: 'Help',
      component: KnowledgeBase,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/ticket/:id',
      name: 'TicketDetail',
      component: () => import('../views/TicketDetail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/create-ticket',
      name: 'TicketForm',
      component: () => import('../views/TicketForm.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.init()

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (requiresAdmin && !authStore.isAdmin) {
    alert('Akses Terbatas: Hanya untuk Admin.')
    next('/')
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
