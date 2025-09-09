import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthTabs = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onLogin = () => navigate('/login', { replace: true });
  const onRegister = () => navigate('/register', { replace: true });

  return (
    <div className="auth-tabs">
      <button
        className={`tab ${pathname === '/login' ? 'active' : ''}`}
        onClick={onLogin}
        type="button"
      >
        Login
      </button>
      <button
        className={`tab ${pathname === '/register' ? 'active' : ''}`}
        onClick={onRegister}
        type="button"
      >
        Register
      </button>
    </div>
  );
};

export default AuthTabs;
