import { lazy } from 'react';

export { default as PrivateRoute } from './PrivateRoute';

export default [
  {
    path: '/qna',
    component: lazy(() => import('../pages/Qna')),
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
  {
    path: '/orders',
    component: lazy(() => import('../pages/Orders')),
    secret: false,
  },
  {
    path: '/events/detail/:id',
    component: lazy(() => import('../pages/EventDetail')),
    secret: false,
  },
  {
    path: '/events/detail',
    component: lazy(() => import('../pages/EventDetail')),
    secret: false,
  },
  {
    path: '/events',
    component: lazy(() => import('../pages/EventList')),
    secret: false,
  },
  {
    path: '/login',
    component: lazy(() => import('../pages/Login')),
    secret: false,
  },
  {
    path: '/',
    component: lazy(() => import('../pages/Home')),
    secret: false,
  },
];
