import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import Vuent from 'vuent'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vuent/dist/vuent.min.css'

Vue.use(Vuent)
Vue.use(VueMaterial)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
