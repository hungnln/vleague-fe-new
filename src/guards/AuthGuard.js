import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
// hooks
import useAuth from '../hooks/useAuth';
// pages
import Login from '../pages/authentication/Login';
import { useSelector } from 'src/redux/store';
import { isValidToken } from 'src/utils/jwt';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);
  const { myProfile } = useSelector(state => state.user)
  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (!isValidToken(localStorage.getItem('accessToken')) && isAuthenticated) {
    logout();
    localStorage.removeItem('accessToken')
  }


  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
