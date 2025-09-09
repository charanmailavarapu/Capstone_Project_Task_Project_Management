import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../Services/authService';
import { toast } from 'react-toastify';

/* ---------- Keys for localStorage ---------- */
const tokenKey = 'tpm.token';
const userKey = 'tpm.user';

/* ---------- Initial State ---------- */
const initialState = {
  token: localStorage.getItem(tokenKey),
  user: JSON.parse(localStorage.getItem(userKey) || 'null'),
  status: 'idle',
  error: null,
};

/* ---------- Helpers ---------- */
const normalizeAuthPayload = (raw) => {
  const src = raw?.data ?? raw ?? {};

  const token =
    src.token ?? src.accessToken ?? src.Token ?? src.AccessToken ??
    (typeof src === 'string' ? src : null);

  const user = src.user ?? src.profile ?? src.User ?? src.Profile ?? {
    id: src.Id ?? src.id ?? null,
    email: src.Email ?? src.email ?? null,
    fullName: src.FullName ?? src.fullName ?? null,
    role: src.Role ?? src.role ?? null,
  };

  return { token, user };
};

/* ---------- Thunks ---------- */
export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    return await api.login(payload);
  } catch (e) {
    return rejectWithValue(e?.response?.data || e.message);
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    return await api.register(payload);
  } catch (e) {
    return rejectWithValue(e?.response?.data || e.message);
  }
});

/* ---------- Slice ---------- */
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
      toast.info('Logged out');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(login.fulfilled, (s, { payload }) => {
        const { token, user } = normalizeAuthPayload(payload);
        s.status = 'succeeded';
        s.token = token || null;
        s.user = user || null;

        if (s.token) localStorage.setItem(tokenKey, s.token);
        if (s.user) localStorage.setItem(userKey, JSON.stringify(s.user));

  // Removed duplicate toast. Only Login.jsx will show welcome toast.
      })
      .addCase(login.rejected, (s, { payload, error }) => {
        s.status = 'failed';
        s.error =
          payload?.message || payload?.error || payload?.title || payload ||
          error?.message || 'Login failed';
        toast.error(String(s.error));
      })

      // Register
      .addCase(register.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(register.fulfilled, (s) => {
        s.status = 'succeeded';
        toast.success('Account created. Please sign in.');
      })
      .addCase(register.rejected, (s, { payload, error }) => {
        s.status = 'failed';
        s.error =
          payload?.message || payload?.error || payload?.title || payload ||
          error?.message || 'Registration failed';
        toast.error(String(s.error));
      });
  },
});

export const { logout } = slice.actions;
export const selectAuth = (state) => state?.auth || initialState;
export default slice.reducer;
