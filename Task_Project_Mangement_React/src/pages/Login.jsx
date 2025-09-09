import React, { useState } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login as loginThunk } from '../redux/slices/authSlice';
import AuthTabs from '../components/AuthTabs';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.info('Please enter email and password');
      return;
    }
    setSubmitting(true);
    try {
      const res = await dispatch(loginThunk(form)).unwrap();
      navigate('/home', { replace: true, state: { from: location.state?.from } });
      setTimeout(() => {
        toast.success(`Welcome back!, ${res?.FullName}! Your role: ${res?.Role}`);
      }, 300);
    } catch (err) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };


  return (
  <div className="login-bg">
    <div className="login-left">
  <h1>WELCOME</h1>
  <h2>Task Project Management Platform</h2>
  <p>Organize, track, and collaborate on your projects efficiently with TPM. Login to get started!</p>
    </div>
    <div className="login-right">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo.png" alt="Logo" />
          <h2>Sign in</h2>
          <p>Login to enjoy a better experience and unlock all features!</p>
        </div>
        <form className="login-form" onSubmit={submit}>
          <label htmlFor="username">User Name</label>
          <input
            id="username"
            className="login-input"
            placeholder="User Name"
            type="text"
            value={form.email}
            onChange={(e)=>setForm(f=>({ ...f, email:e.target.value }))}
            autoFocus
          />
          <label htmlFor="password">Password</label>
          <div className="password-row">
            <input
              id="password"
              className="login-input"
              placeholder="Password"
              type={show ? 'text' : 'password'}
              value={form.password}
              onChange={(e)=>setForm(f=>({ ...f, password:e.target.value }))}
            />
            <button type="button" className="show-btn" onClick={()=>setShow(s=>!s)}>
              {show ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          <div className="login-form-options">
            <label><input type="checkbox" /> Remember me</label>
          </div>
          <button
            className="login-btn"
            disabled={submitting}
          >
            Sign in
          </button>
        </form>
        <div className="login-footer">
          Don't have an account?
          <a href="/register">Sign Up</a>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
