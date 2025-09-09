import React, { useState } from 'react';
import './Register.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register as registerThunk } from '../redux/slices/authSlice';
import AuthTabs from '../components/AuthTabs';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Viewer'
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.role) {
      toast.info('Please fill all fields');
      return;
    }
    // DEBUG: Print registration payload
    console.log('Register payload:', form);
    setSubmitting(true);
    try {
      const res = await dispatch(registerThunk(form)).unwrap();
      // toast.success('Account created. Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-left">
        <h1>WELCOME</h1>
        <h2>Task Project Management Platform</h2>
        <p>Organize, track, and collaborate on your projects efficiently with TPM. Register to get started!</p>
      </div>
      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <img src="/logo.png" alt="Logo" />
            <h2>Sign up</h2>
            <p>Create your TPM account to unlock all features!</p>
          </div>
          <form className="login-form" onSubmit={submit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="login-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e)=>setForm(f=>({ ...f, email:e.target.value }))}
            />
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              className="login-input"
              placeholder="Your name"
              value={form.fullName}
              onChange={(e)=>setForm(f=>({ ...f, fullName:e.target.value }))}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e)=>setForm(f=>({ ...f, password:e.target.value }))}
            />
            <label htmlFor="role">Role</label>
            <select
              id="role"
              className="login-input"
              value={form.role}
              onChange={(e)=>setForm(f=>({ ...f, role:e.target.value }))}
            >
              <option value="Viewer">Viewer</option>
              <option value="TeamMember">TeamMember</option>
              <option value="ProjectManager">ProjectManager</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              className="login-btn"
              disabled={submitting}
            >
              {submitting ? 'Creating…' : 'Create account'}
            </button>
          </form>
          <div className="login-footer">
            Already have an account?
            <a href="/login">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
