import { useContext } from 'react';
import { Outlet } from 'react-router';
import { isEmpty } from 'lodash';
import { UserContext } from '../../context/User';
import PrincipalPage from '../../pages/LandingPage';

export const GuardedRoute = () => {
  const { user } = useContext(UserContext);

  if (!isEmpty(user)) {
    return <Outlet />;
  }

  return <PrincipalPage />;
};
