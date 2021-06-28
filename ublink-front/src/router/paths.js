import mrPaths from './mrPaths';
import adminPaths from './adminPaths';
import contPaths from './contPaths';

function makeSubRoute(area, path, view, name, propMeta, props, redirect) {
  if (name) {
    return {
      name: name || view,
      path,
      component: resovle => import(`../views/business/${area}/${view}.vue`).then(resovle),
      meta: propMeta,
      props,
      redirect,
    };
  }
  return {
    path,
    component: resovle => import(`../views/business/${area}/${view}.vue`).then(resovle),
    meta: propMeta,
    props,
    redirect,
  };
}

export default [
  {
    path: '/',
    redirect: { name: 'Login' },
  },
  {
    path: '/login',
    name: 'Login',
    view: 'Login',
  },
  {
    path: '/mr',
    view: 'mrLayout',
    area: 'mr',
    children: mrPaths.map(path => makeSubRoute('mr', path.path, path.view, path.name, path.meta, path.props, path.redirect)),
  },
  {
    path: '/cont',
    view: 'contLayout',
    area: 'cont',
    children: contPaths.map(path => makeSubRoute('cont', path.path, path.view, path.name, path.meta, path.props, path.redirect)),
  },
  {
    path: '/admin',
    view: 'adminLayout',
    area: 'admin',
    children: adminPaths.map(path => makeSubRoute('admin', path.path, path.view, path.name, path.meta, path.props, path.redirect)),
  },
];
