export default {
  setUserInfo(state, replace) {
    const s = state;
    s.userInfo = replace;
  },
  setUserMenu(state, replace) {
    const s = state;
    s.userMenu = replace;
  },
  setUserId(state, replace) {
    const s = state;
    s.userId = replace;
  },
  setUserNm(state, replace) {
    const s = state;
    s.userNm = replace;
  },
  setDeptId(state, replace) {
    const s = state;
    s.deptId = replace;
  },
  setDeptNm(state, replace) {
    const s = state;
    s.deptNm = replace;
  },
  setSearchPerm(state, replace) {
    const s = state;
    s.searchPerm = replace;
  },
  setSalesEmpYn(state, replace) {
    const s = state;
    s.salesEmpYn = replace;
  },
  setOption(state, replace) {
    const s = state;
    s.option = replace;
  },
  setSubmitYn(state, replace) {
    const s = state;
    s.submitYn = replace;
  },
  setRouteParams(state, replace) {
    const s = state;
    s.routeParams[replace.routeName] = replace;
  },
};
