import { lazy } from 'react';

export { default as PrivateRoute } from './PrivateRoute';

export default [
  {
    path: '/home',
    component: lazy(() => import('../pages/Home')),
    secret: false,
  },
  {
    path: '/review',
    component: lazy(() => import('../pages/Review')),
  },
  {
    path: '/events/detail/:id',
    component: lazy(() => import('../pages/event/EventDetail')),
    secret: false,
  },
  {
    path: '/events/detail',
    component: lazy(() => import('../pages/event/EventDetail')),
    secret: false,
  },
  {
    path: '/events',
    component: lazy(() => import('../pages/event/EventList')),
    secret: false,
  },
];
