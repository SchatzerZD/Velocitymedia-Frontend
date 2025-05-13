import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Draft from '@/views/tools/Draft.vue'
import Log from '@/views/tools/Log.vue'
import BTS from '@/views/tools/BTS.vue'
import Admin from '@/views/tools/Admin.vue'
import { tokenStore } from '@/stores/tokenStore'
import Review from '@/views/Review.vue'
import AdminDashboard from '@/views/tools/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },

    {
      path: '/bts',
      name: 'BTS',
      component: BTS
    },
    {
      path: '/Log',
      name: 'Log',
      component: Log
    },
    {
      path: '/draft',
      name: 'Draft',
      component: Draft
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminDashboard
    },
    {
      path: '/review',
      name: 'Review',
      component: Review
    },

    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound
    }
  ],
})

router.beforeEach(async (to, from) => {
  if (!tokenStore().user.jwt && to.name !== 'Home') {
    return { name: 'Home' }
  }

  if(!tokenStore().user.admin && to.name === 'Admin'){
    return { name: 'Home' }
  }

})


export default router
