import axios from 'axios';

// Store에 데이터를 저장하기 위해 사용해야 할 경우 actions.js 스크립트를 통해 데이터 Commit
export default {
  // 화면별 옵션항목 조회
  getMenuOption({ commit }, menuId) {
    const reqUrl = '/business/SWNAjaxL.do';
    const params = { ac: 'COMM04', menuId };

    return axios.post(reqUrl, new URLSearchParams(params)).then((rs) => {
      const clsOption = rs.data.resultList[0];
      const arrOption = {};

      for (let i = 0; i < clsOption.length; i += 1) {
        const clsRow = clsOption[i];
        arrOption[clsRow.OPT_ID] = clsRow.OPT_SET_VAL;
      }
      commit('setOption', arrOption);
    }).catch((err) => {
      throw new Error(err.message);
    });
  },
  // 로그인 후 메뉴 및 사용자정보 조회
  getUserInfo({ commit }) {
    const reqUrl = '/business/selectMenuList.do';
    return axios.post(reqUrl, '').then((rs) => {
      const clsMenu = [];
      const clsUserInfo = JSON.parse(rs.data.userInfo);

      const clsParent = rs.data.userMenu[0];
      const clsChild = rs.data.userMenu[1];

      for (let i = 0; i < clsParent.length; i += 1) {
        const clsRow = clsParent[i];
        const arrChild = [];
        for (let j = 0; j < clsChild.length; j += 1) {
          const clsCol = clsChild[j];

          if (clsRow.MENU_ID === clsCol.PRNT_MENU_ID) {
            arrChild.push(clsCol);
          }
        }
        clsMenu.push({
          MENU_ID: clsRow.MENU_ID,
          MENU_NM: clsRow.MENU_NM,
          ICON: clsRow.ICON,
          IS_NEW: clsRow.IS_NEW,
          SUB: arrChild,
        });
      }

      commit('setUserMenu', clsMenu);
      commit('setUserInfo', clsUserInfo);
      commit('setUserId', clsUserInfo.UserId);
      commit('setUserNm', clsUserInfo.UserNm);
      commit('setDeptId', clsUserInfo.DeptId);
      commit('setDeptNm', clsUserInfo.DeptNm);
      commit('setSearchPerm', clsUserInfo.SearchPerm);
      commit('setSalesEmpYn', clsUserInfo.SalesEmpYn);
    }).catch((err) => {
      // (김영도) 에러 발생 시, 로그인페이지로 이동
      // payload.router.push('/login');
      throw new Error(err.message);
    });
  },
};
