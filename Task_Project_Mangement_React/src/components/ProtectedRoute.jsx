import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectAuth } from '../redux/slices/authSlice';

const isTruthyToken = (t) => Boolean(t) && t !== 'null' && t !== 'undefined' && t !== '""';

const ProtectedRoute = ({ children }) => {
  const { token, user } = useSelector(selectAuth);
  const { pathname } = useLocation();

  const storedToken = localStorage.getItem('tpm.token');
  const authed = isTruthyToken(token) || isTruthyToken(storedToken) || Boolean(user);

  if (!authed) return <Navigate to="/login" replace state={{ from: pathname }} />;

  return children;
};

export default ProtectedRoute;
