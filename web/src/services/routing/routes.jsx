import { Home } from '../../pages/Home';
import { Login } from '../../pages/Login';
import { Maps } from '../../pages/Maps';

export const routesConfig = [
  {
    name: 'Root',
    path: '/',
    component: <Home />,
  },
  {
    name: 'Maps',
    path: '/maps',
    component: <Maps />,
  },
  {
    name: 'Login',
    path: '/login',
    component: <Login />,
  },
  {
    name: 'All',
    path: '*',
    component: <Home />,
  },
];
