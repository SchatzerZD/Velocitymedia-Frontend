import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Draft from '@/views/tools/Draft.vue'
import Log from '@/views/tools/Log.vue'
import BTS from '@/views/tools/BTS.vue'

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
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound
    }
  ],
})

export default router
