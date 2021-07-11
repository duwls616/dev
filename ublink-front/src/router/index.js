import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import paths from './paths';

Vue.prototype.$axios = axios;

Vue.use(VueRouter);

function makeRoute(path, view, name, area, propMeta, propChildren) {
  const areaURL = (area) ? 'views/layouts' : 'views';
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

// 새로고침을 통해 접근시 ==> 라우터 기반에서는 새로고침은 불필요하므로 이와같이 정의
// (세션이 남아있을 경우) 메인 화면
// (세션이 만료됐을 경우) 로그인 화면으로 이동
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next();
  } else {
    // 사용자 권한체크 후 Layout 구분 로직 들어가야 함
    next();
  }
});

router.afterEach(() => {
});

export default router;
