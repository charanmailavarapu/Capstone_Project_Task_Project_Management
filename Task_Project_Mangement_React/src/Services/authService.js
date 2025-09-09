import { post } from './api';

const LOGIN_PATH    = process.env.REACT_APP_AUTH_LOGIN_PATH    || '/api/Auth/login';
const REGISTER_PATH = process.env.REACT_APP_AUTH_REGISTER_PATH || '/api/Auth/register';

// Send names most .NET binders accept
const authBody = ({ email, password, fullName }) => ({
  email, password, fullName,
  Email: email, Password: password, FullName: fullName,
  username: email, userName: email, UserName: email,
  EmailOrUsername: email,
});

export const login = ({ email, password }) =>
  post(LOGIN_PATH, authBody({ email, password }));

export const register = async (payload) => {
  // Only send required fields in PascalCase
  const body = {
    Email: payload.Email || payload.email,
    FullName: payload.FullName || payload.fullName,
    Password: payload.Password || payload.password,
    Role: payload.Role || payload.role || '',
  };
  return post('/api/Auth/register', body);
};
