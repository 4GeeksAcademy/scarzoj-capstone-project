import { Routes, Route } from 'react-router';
import { NavBar } from './components/NavBar';
import { routesConfig } from './services/routing/routes';
import { GuardedRoute } from './components/routing/GuardedRoute';
import { LoginRedirect } from './components/routing/LoginRedirect';

export const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginRedirect />} />
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
