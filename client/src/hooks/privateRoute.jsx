import { Outlet, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export const PrivateRoutes = () => {
  const [cookies] = useCookies(['access_token']);
  const isAuthenticated = () => !!localStorage.getItem('userID') && !!cookies.access_token;

  console.log('=========> autenticado?', isAuthenticated());

  return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
};