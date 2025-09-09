// src/components/Navbar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectAuth, logout } from '../redux/slices/authSlice';
import { selectTasks } from '../redux/slices/tasksSlice';
import './Navbar.css';

const Bell = ({ count = 0, onClick }) => (
  <div style={{ position:'relative' }}>
    <button className="btn" onClick={onClick} title="Notifications">
      🔔
    </button>
    {count > 0 && (
      <span style={{
        position:'absolute', top:-6, right:-6, background:'#ef4444',
        color:'#fff', borderRadius:999, fontSize:11, padding:'2px 6px'
      }}>{count}</span>
    )}
  </div>
);

export default function Navbar() {
  const dropdownRef = React.useRef();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);
  const { user, token } = useSelector(selectAuth);
  const { byProject } = useSelector(selectTasks);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Removed duplicate declaration of open/setOpen

  const overdueCount = useMemo(() => {
    const all = Object.values(byProject).flat();
    const today = new Date(); today.setHours(0,0,0,0);

    return all.filter(t => {
      const s = t.status ?? t.Status;
      if (s === 'Done') return false;
      const d = t.dueDate ?? t.DueDate;
      if (!d) return false;
      const dd = new Date(d); dd.setHours(0,0,0,0);
      return dd < today;
    }).length;
  }, [byProject]);

  useEffect(() => {
    if (overdueCount > 0 && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`You have ${overdueCount} overdue task(s)`);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, [overdueCount]);

  const doLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const reduxUser = user;
  const localUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('tpm.user'));
    } catch {
      return null;
    }
  })();
  const displayUser = reduxUser || localUser || {};

  return (
    <div className="navbar-bg">
      <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link className="navbar-logo" to="/" style={{ fontWeight: 700, fontSize: 22, color: '#1976d2', textDecoration: 'none', marginRight: 24 }}>Trello Clone</Link>

        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          {token && (
            <>
              <Bell count={overdueCount} onClick={() => navigate('/projects')} />
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  className="navbar-btn"
                  style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: 0 }}
                  onClick={() => setOpen(v => !v)}
                  title={displayUser?.fullName || displayUser?.email}
                >
                  <span role="img" aria-label="person" style={{ marginRight: 8 }}>👤</span>
                </button>
                {open && (
                  <div className="card" style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                    width: 220, padding: 10, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: '#fff', borderRadius: 8
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 16 }}>{displayUser?.fullName || displayUser?.email}</div>
                    <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>{displayUser?.role || displayUser?.Role || 'Admin'}</div>
                    <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>{displayUser?.email}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button className="navbar-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
                      <button className="navbar-btn" onClick={() => navigate('/forgot-password')}>Forgot Password</button>
                      <button className="navbar-btn" onClick={() => window.open('https://help.trello.com/', '_blank')}>Help</button>
                      <button className="navbar-btn" onClick={doLogout} style={{ background: '#ef4444', color: '#fff', border: 'transparent' }}>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
