import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import projects from './slices/projectsSlice';
import tasks from './slices/tasksSlice';

export default configureStore({
  reducer: { auth, projects, tasks }
});
