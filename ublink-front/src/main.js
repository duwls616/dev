import Vue from 'vue';
import { Common } from '@/assets/lib/mixin/common';
import { Filter } from '@/assets/lib/mixin/filter';
import { CommAxios } from '@/assets/lib/mixin/axios';
import { dialog } from '@/assets/lib/mixin/dialog';
import HighCharts3D from 'highcharts/highcharts-3d';
import HighCharts from 'highcharts';
import router from '@/router';
import store from './store';
import App from './App.vue';
// import './registerServiceWorker';

import vuetify from './assets/plugins/vuetify';

HighCharts3D(HighCharts);

// eslint-disable-next-line
Vue.config.warnHandler = function () {}; // 디버깅 모드에서 Vue-warn 오류로그 비활성화
Vue.config.productionTip = false;

// eslint-disable-next-line
Kakao.init('f8d6a3e5ce1475f59118aea3b0b1dfa0');
let app;
if (!app) {
  Vue.mixin(Common);
  Vue.mixin(Filter);
  Vue.mixin(CommAxios);
  Vue.mixin(dialog);

  /* eslint-disable no-new */
  app = new Vue({
    vuetify,
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}
