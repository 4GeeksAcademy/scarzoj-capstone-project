import { Routes, Route } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './components/NavBar';
import { routesConfig } from './services/routing/routes';
import { GuardedRoute } from './components/routing/GuardedRoute';
import { LoginRedirect } from './components/routing/LoginRedirect';
import Adondeir from './pages/Adondeir';

export const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginRedirect />} />

        {/* Nueva ruta pública??? */}
        <Route path="/Adondeir" element={<Adondeir />} />

        {/* Rutas privadas */}
        <Route element={<GuardedRoute />}>
          {routesConfig.map((route) => (
            <Route
              key={route.name}
              path={route.path}
              element={route.component}
            />
          ))}
        </Route>
      </Routes>
    </>
  );
};
