import { get } from './api';

export const fetchAllUsers = () => get('/api/Admin/users');
