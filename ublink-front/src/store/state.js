export default {
  userInfo: null,
  userMenu: null,
  userId: null,
  userNm: null,
  deptId: null,
  deptNm: null,
  searchPerm: null,
  salesEmpYn: null,
  option: null,
  submitYn: null,
  /**
   * Router Parameter($route.params)를 캐시하기 위한 객체
   * Router Name이 화면의 키가 되며, Name을 통해 저장된 파라메터 객체를 반환
   * (데이터구조)
   * {
   *    CompDetail: {compId: B0001},
   *    ContDetail: {compId: B0001, contId: C0001}
   * }
   */
  routeParams: {},
};
