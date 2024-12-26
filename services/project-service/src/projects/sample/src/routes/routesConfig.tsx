
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
const About = lazy(() => import('../pages/About'));

const Home = lazy(() => import('../pages/Home'));

const routes = [{
    path: '/home',
    element: <Home />,
    meta: {
      title: 'Home Page',
      description: 'Home Page of  Descritpion',
    },
  }, {
    path: '/about',
    element: <About />,
    meta: {
      title: 'About Page',
      description: 'About Page of  Descritpion',
    },
  }];

export const router = createBrowserRouter(routes);
export default routes;
