/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    path: '',
    view: 'Dashboard',
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: 'dashboard',
    view: 'Dashboard',
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: 'invitation',
    view: 'Invitation',
    name: 'Invitation',
    meta: {
      title: '초대장',
    },
  },
  {
    path: 'survey',
    view: 'Survey',
    name: 'Survey',
    meta: {
      title: '설문조사',
    },
  },
  {
    path: 'brochure',
    view: 'Brochure',
    name: 'Brochure',
    meta: {
      title: '브로셔',
    },
  },
  {
    path: 'seminar',
    view: 'Seminar',
    name: 'Seminar',
    meta: {
      title: '제품설명회 관리',
    },
  },
  {
    path: 'seminarreq',
    view: 'SeminarReq',
    name: 'SeminarReq',
    meta: {
      title: '제품설명회 신청현황',
    },
  },
  {
    path: 'msglog',
    view: 'MsgLog',
    name: 'MsgLog',
    meta: {
      title: '전송로그 관리',
    },
  },
  {
    path: 'chennelmem',
    view: 'ChennelMem',
    name: 'ChennelMem',
    meta: {
      title: '채널가입현황',
    },
  },
  {
    path: 'mrrecord',
    view: 'MrRecord',
    name: 'MrRecord',
    meta: {
      title: '레코드관리',
    },
  },
  {
    path: 'contmng',
    view: 'ContMng',
    name: 'ContMng',
    meta: {
      title: '고객관리',
    },
  },
  {
    path: 'usermng',
    view: 'UserMng',
    name: 'UserMng',
    meta: {
      title: '사용자관리',
    },
  },
  {
    path: 'deptmng',
    view: 'DeptMng',
    name: 'DeptMng',
    meta: {
      title: '부서관리',
    },
  },
  {
    path: 'groupauthmng',
    view: 'GroupAuthMng',
    name: 'GroupAuthMng',
    meta: {
      title: '그룹권한관리',
    },
  },
  {
    path: 'contgroupmng',
    view: 'ContGroupmng',
    name: 'ContGroupmng',
    meta: {
      title: '고객그룹화',
    },
  },
];
