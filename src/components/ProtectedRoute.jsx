import React from 'react';
import { Navigate } from 'react-router-dom';

export const isAuthenticated = () => localStorage.getItem('isLoggedIn') === 'true';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
