import { Home } from '../../pages/HomePage';
import { Login } from '../../pages/LoginPage';

export const routesConfig = [
  {
    name: 'Root',
    path: '/',
    component: <Home />,
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
