import Adondeir from '../../pages/Adondeir';
import Inicio from '../../pages/Inicio';

export const routesConfig = [
  {
    name: 'Root',
    path: '/',
    component: <Inicio />,
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
    private: false,
  },
];
