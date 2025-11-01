import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import MyItemsPage from '@/pages/MyItemsPage.vue'
import LoginForm from '@/components/LoginForm.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import { useAuthStore } from '@/store/AuthStore'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginForm },
  { path: '/register', component: RegisterForm },
  { path: '/my-items', component: MyItemsPage, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) next('/login')
  else next()
})

export default router
