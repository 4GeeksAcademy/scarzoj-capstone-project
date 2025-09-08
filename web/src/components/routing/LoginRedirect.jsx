import { useContext } from 'react';
import { Navigate } from 'react-router';
import { isEmpty } from 'lodash';

import { UserContext } from '../../context/User';
import { Login } from '../../pages/LoginPage';

export const LoginRedirect = () => {
  const { user } = useContext(UserContext);

  if (!isEmpty(user)) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
};
