import { lazy } from 'react';

export { default as PrivateRoute } from './PrivateRoute';

export default [
  {
    path: '/events/new',
    component: lazy(() => import('../pages/event/CreateEventForm')),
    secret: false,
  },
  {
    path: '/events',
    component: lazy(() => import('../pages/event/EventList')),
    secret: false,
  },
  {
    path: '/home',
    component: lazy(() => import('../pages/Home')),
    secret: false,
  },
  {
    path: '/',
    component: lazy(() => import('../pages/Login')),
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
