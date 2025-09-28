import Adondeir from '../../pages/Adondeir';
import Inicio from '../../pages/Inicio';
import { Login } from '../../pages/Login';

export const routesConfig = [
  {
    name: 'Root',
    path: '/',
    component: <Inicio />,
  },
  {
    name: 'Login',
    path: '/login',
    component: <Login />,
  },
  {
    name: 'All',
    path: '*',
    component: <Inicio />,
  },
  {
    name: 'Adondeir',
    path: '/Adondeir',
    component: <Adondeir />,
    private: false, // 👈 así la consideras pública
  },
];
