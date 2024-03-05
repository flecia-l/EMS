import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/less/index.less'

import router from './router'
import store from './store'
import http from 'axios'
import '@/api/mock'



Vue.use(ElementUI);

Vue.prototype.$http = http
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.prototype.$message = ElementUI.Message

Vue.config.productionTip = false

new Vue({
  store:store,
  router,
  render: h => h(App),
  created() {
    store.commit('tab/ADD_MENU',router);
    // store.commit('user/DEL_TOKEN');
    // store.commit('tab/DEL_MENU');
    // router.push('/login');
  }
}).$mount('#app')
