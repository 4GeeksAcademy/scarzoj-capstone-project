import DogFriendly from '../../pages/Inicio';
import { Login } from '../../pages/Login';

export const routesConfig = [
  {
    name: 'Root',
    path: '/',
    component: <DogFriendly />,
  },
  {
    name: 'Login',
    path: '/login',
    component: <Login />,
  },
  {
    name: 'All',
    path: '*',
    component: <DogFriendly />,
  },
];
