import { useContext } from 'react';
import { Navigate } from 'react-router';
import { isEmpty } from 'lodash';

import { UserContext } from '../../context/User';
import { Inicio } from '../../pages/Inicio';

export const LoginRedirect = () => {
  const { user } = useContext(UserContext);

  if (!isEmpty(user)) {
    return <Navigate to="/" replace />;
  }

  return <Inicio />;
};
