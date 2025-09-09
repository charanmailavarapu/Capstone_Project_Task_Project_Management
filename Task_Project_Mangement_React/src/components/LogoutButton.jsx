import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LogoutButton.css';

const LogoutButton = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem('tpm.token');
    localStorage.removeItem('tpm.user');
    toast.info('Logged out');
    navigate('/login', { replace: true });
  };

  return (
    <button type="button" className="logout-btn" onClick={onLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
