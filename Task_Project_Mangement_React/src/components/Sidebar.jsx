/* Sidebar.jsx - Jira-like UI for sidebar navigation */
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('tpm.user'));
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'Admin' || user?.Role === 'Admin';
  return (
    <aside className="sidebar-bg">
      <div className="sidebar-container">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">TPM</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/home" className="sidebar-link" aria-label="Home">
            <span role="img" aria-label="home" style={{ marginRight: 8 }}>🏠</span> Home
          </Link>
          <Link to="/dashboard" className="sidebar-link" style={!isLoggedIn ? { pointerEvents: 'none', opacity: 0.5 } : {}} aria-label="Dashboard">
            <span role="img" aria-label="dashboard" style={{ marginRight: 8 }}>📊</span> Dashboard
          </Link>
          <Link to="/projects" className="sidebar-link" style={!isLoggedIn ? { pointerEvents: 'none', opacity: 0.5 } : {}} aria-label="Projects">
            <span role="img" aria-label="projects" style={{ marginRight: 8 }}>🗂️</span> Projects
          </Link>
          {isAdmin && (
            <Link to="/admin/users" className="sidebar-link" aria-label="Admin">
              <span role="img" aria-label="admin" style={{ marginRight: 8 }}>🔒</span> Admin
            </Link>
          )}
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-muted">© {new Date().getFullYear()} TPM</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
