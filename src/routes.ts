import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/layout.vue'
import Create from '@/pages/rules/new.vue'
import Rule from '@/pages/rules/rule.vue'
import Home from '@/pages/home/home.vue'
// import Setting from '@/pages/settings/settings.vue'

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
        // {
        //   path: '/settings',
        //   component: Setting,
        // },
        {
          path: '/new',
          component: Create,
        },
        {
          path: '/rules/:name?',
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
