import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import router from './router';
import store from './store';
import ApiService from './services/api.service';
import VHijriDatePicker from 'vuetify-umalqura';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { SERVER_URL } from '../config';
Vue.use(VueRouter);
Vue.config.productionTip = false;
ApiService.init(SERVER_URL);
Vue.component(VHijriDatePicker.name, VHijriDatePicker);
Vue.component('vue-phone-number-input', VuePhoneNumberInput);

new Vue({
  vuetify,
  router: router,
  store,
  render: (h) => h(App),
}).$mount('#app');
