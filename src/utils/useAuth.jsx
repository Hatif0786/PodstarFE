// useAuth.jsx

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = () => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
    setLoading(false);
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

  return { isAuthenticated, loading, checkAuth, logout };
};

export default useAuth;
