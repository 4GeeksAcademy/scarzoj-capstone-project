import { Outlet } from 'react-router';
import { NavBar } from '../NavBar';
import { Footer } from '../Footer';

export const ProtectedNavBar = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};
