/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    path: 'dashboard',
    view: 'Dashboard',
    name: 'Dashboard',
    meta: {
      title: '대시보드',
    },
  },
  {
    path: 'channelist',
    view: 'ChannelList',
    name: 'ChannelList',
    meta: {
      title: '채널목록',
    },
  },
  {
    path: 'adminrecord',
    view: 'AdminRecord',
    name: 'AdminRecord',
    meta: {
      title: '레코드',
    },
  },
  {
    path: 'layout',
    view: 'Layout',
    name: 'Layout',
    meta: {
      title: '레이아웃이동',
    },
  },
];
