import { lazy } from 'react';

export { default as PrivateRoute } from './PrivateRoute';

export default [
  {
    path: '/shipping',
    component: lazy(() => import('../pages/Shipping')),
    secret: true,
  },
  {
    path: '/qna',
    component: lazy(() => import('../pages/Qna')),
    secret: true,
  },
  {
    path: '/review',
    component: lazy(() => import('../pages/Review')),
    secret: true,
  },
  {
    path: '/contact',
    component: lazy(() => import('../pages/Contact')),
    secret: true,
  },
  {
    path: '/orders',
    component: lazy(() => import('../pages/Orders')),
    secret: true,
  },
  {
    path: '/events/detail/:id',
    component: lazy(() => import('../pages/EventDetail')),
    secret: true,
  },
  {
    path: '/events/detail',
    component: lazy(() => import('../pages/EventDetail')),
    secret: true,
  },
  {
    path: '/events',
    component: lazy(() => import('../pages/EventList')),
    secret: true,
  },
  {
    path: '/home',
    component: lazy(() => import('../pages/Home')),
    secret: true,
  },
  {
    path: '/',
    component: lazy(() => import('../pages/Login')),
    secret: false,
  },
];
