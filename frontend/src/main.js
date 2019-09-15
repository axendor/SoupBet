import Vue from 'vue'
import App from './App.vue'
import Bootstrap from 'bootstrap'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'
import store from './store'
import Vuex from 'vuex'

Vue.use(BootstrapVue,Vuex);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
