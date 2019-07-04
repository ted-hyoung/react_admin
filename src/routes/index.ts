import { lazy } from 'react';

export { default as PrivateRoute } from './PrivateRoute';

export default [
  {
    path: '/',
    component: lazy(() => import('../pages/Login')),
    secret: false,
  },
  {
    path: '/home',
    component: lazy(() => import('../pages/Home')),
    secret: false,
  },
  {
    path: '/review',
    component: lazy(() => import('../pages/Review')),
    secret: false,
  },
  {
    path: '/contact',
    component: lazy(() => import('../pages/Contact')),
    secret: false,
  },
];
