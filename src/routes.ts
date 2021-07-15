import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/layout.vue'
import Create from '@/pages/new.vue'
import Rule from '@/pages/rule.vue'
import Home from '@/pages/home.vue'

export default createRouter({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/',
          component: Home,
        },
        {
          path: '/new',
          component: Create,
        },
        {
          path: '/rules/:name',
          component: Rule,
        },
        {
          path: '/rules/:name/:menu',
          component: Rule,
        },
      ]
    },
  ],
  history: createWebHistory(),
})
