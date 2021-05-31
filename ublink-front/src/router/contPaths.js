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
    path: 'survay',
    view: 'Survay',
    name: 'Survay',
    meta: {
      title: '설문진행',
    },
  },
  {
    path: 'survayresult',
    view: 'SurvayResult',
    name: 'SurvayResult',
    meta: {
      title: '설문결과보고',
    },
  },
  {
    path: 'brochure',
    view: 'Brochure',
    name: 'Brochure',
    meta: {
      title: '브로셔 구독',
    },
  },
  {
    path: 'seminarinfo',
    view: 'SeminarInfo',
    name: 'SeminarInfo',
    meta: {
      title: '설명회정보',
    },
  },
  {
    path: 'seminarinvi',
    view: 'SeminarInvi',
    name: 'SeminarInvi',
    meta: {
      title: '모바일초청장',
    },
  },
  {
    path: 'qrcode',
    view: 'Qrcode',
    name: 'Qrcode',
    meta: {
      title: '개인QR',
    },
  },
  {
    path: 'sign',
    view: 'Sign',
    name: 'Sign',
    meta: {
      title: '사후서명',
    },
  },
];
