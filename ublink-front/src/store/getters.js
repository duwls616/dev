export default {
  getUserInfo: state => state.userInfo,
  getUserMenu: state => state.userMenu,
  getUserId: state => state.userId,
  getUserNm: state => state.userNm,
  getDeptId: state => state.deptId,
  getDeptNm: state => state.deptNm,
  getSearchPerm: state => state.searchPerm,
  getSalesEmpYn: state => state.salesEmpYn,
  getOption: state => state.option,
  getSubmitYn: state => state.submitYn,
  /**
   * Router Parameter($route.params)를 캐시하기 위한 객체
   * Router Name이 화면의 키가 되며, Name을 통해 저장된 파라메터 객체를 반환
   * (데이터구조)
   * {
   *    CompDetail: {compId: B0001},
   *    ContDetail: {compId: B0001, contId: C0001}
   * }
   */
  getRouteParams(state) {
    const s = state;
    return (routeName) => {
      const retVal = s.routeParams[routeName];
      return retVal;
    };
  },
};
