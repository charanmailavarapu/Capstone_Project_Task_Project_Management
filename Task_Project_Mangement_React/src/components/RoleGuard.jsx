import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/slices/authSlice';
import './RoleGuard.css';

const RoleGuard = ({ roles = [], children }) => {
  const { user } = useSelector(selectAuth);
  if (!user) return null;
  if (roles.length && !roles.includes(user.role)) {
    return null;
  }
  return children;
};
export default RoleGuard;