import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import router from './router';
import store from './store';
import ApiService from './services/api.service';
import { SERVER_URL } from '../config';
Vue.use(VueRouter);
Vue.config.productionTip = false;
ApiService.init(SERVER_URL);

new Vue({
  vuetify,
  router: router,
  store,
  render: (h) => h(App),
}).$mount('#app');
