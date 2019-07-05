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
    path: '/events',
    component: lazy(() => import('../pages/event/EventList')),
    secret: false,
  },
  {
    path: '/qna',
    component: lazy(() => import('../pages/Qna')),
    secret: false,
  },
  {
    path: '/review',
    component: lazy(() => import('../pages/Review')),
  },
];
