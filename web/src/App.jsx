import { Routes, Route } from 'react-router';

import { NavBar } from './components/NavBar';
import { routesConfig } from './services/routing/routes';
import { GuardedRoute } from './components/routing/GuardedRoute';

export const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route element={<GuardedRoute />}>
          {routesConfig.map((route) => {
            return (
              <Route
                key={route.name}
                path={route.path}
                element={route.component}
              />
            );
          })}
        </Route>
      </Routes>
    </>
  );
};
