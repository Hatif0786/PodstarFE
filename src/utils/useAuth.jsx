// useAuth.jsx

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = () => {
    // Clear the token from cookies
    Cookies.remove('token');
    Cookies.remove('user'); 
    // Set isAuthenticated to false
    setIsAuthenticated(false);
  };

  return { isAuthenticated, checkAuth, logout };
};

export default useAuth;
