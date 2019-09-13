import Vue from 'vue'
import Router from 'vue-router'
import Odds from './views/OddsBoards.vue'
import Admin from './views/AdminPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'odds',
      component: Odds
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    }
  ]
})
