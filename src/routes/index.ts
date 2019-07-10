import { lazy } from 'react';

export { default as PrivateRoute } from './PrivateRoute';

export default [
  {
    path: '/events/new',
    component: lazy(() => import('../pages/event/EventForm')),
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
];
