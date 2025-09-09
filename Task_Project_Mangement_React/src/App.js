import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectBoard from './pages/ProjectBoard';
import TaskDetails from './pages/TaskDetails';
import AdminUsers from './pages/AdminUsers';
import Home from './pages/Home';

import { selectAuth } from './redux/slices/authSlice';
import './App.css';

const App = () => {
  const { pathname } = useLocation();
  const { token } = useSelector(selectAuth);
  const localToken = localStorage.getItem('tpm.token');
  const authed = Boolean(token || localToken);

  // Also treat root (/) as an auth page if not authenticated
  const isRootLogin = pathname === '/' && !authed;
  const isAuthPage = pathname === '/login' || pathname === '/register' || isRootLogin;

  return (
    <div className="app">
      {/* Only show Navbar on non-auth pages */}
      {!isAuthPage && <Navbar />}
      <div className="layout">
        {/* Only show Sidebar on non-auth pages */}
        {!isAuthPage && <Sidebar />}
        <main className="main">
          <Routes>
            {/* Default: show Home for everyone */}
            <Route path="/" element={<Home />} />

            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Home */}
            <Route
              path="/home"
              element={authed ? <Home /> : <Navigate to="/login" replace />}
            />

            {/* Protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <TaskDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={['Admin']}>
                    <AdminUsers />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            {/* Fallback: go to Home if authed or not */}
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      </div>

      <ToastContainer position="bottom-right" newestOnTop />
    </div>
  );
};

export default App;
