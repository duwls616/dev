import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import store from '@/store';
import paths from './paths';

Vue.use(VueRouter);

function makeRoute(path, view, name, area, propMeta, propChildren) {
  const areaURL = (area) ? 'views/layouts' : 'views/business';
  return {
    name: name || view,
    path,
    component: resovle => import(`../${areaURL}/${view}.vue`).then(resovle),
    meta: propMeta,
    children: propChildren,
  };
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: paths.map(path => makeRoute(path.path, path.view, path.name,
  path.area, path.meta, path.children)),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
});

function movePage(to, from, next) {
  axios.post('/business/selectUserModel.do').then((rs) => {
    const clsRow = rs.data;
    console.log(clsRow.returnCode);
    if (clsRow.returnCode === 'CERT_SUCCESS') {
      console.log(clsRow.returnCode);
      store.commit('setSubmitYn', 'N');
      next();
    } else if (clsRow.returnCode === 'CERT_FAIL') {
      next();
    }
  });
}

// 새로고침을 통해 접근시 ==> 라우터 기반에서는 새로고침은 불필요하므로 이와같이 정의
// (세션이 남아있을 경우) 메인 화면
// (세션이 만료됐을 경우) 로그인 화면으로 이동
router.beforeEach((to, from, next) => {
  movePage(to, from, next);
});

router.afterEach(() => {
});

export default router;