// src/redux/slices/projectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchProjectsApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
} from '../../Services/projectService';
import { toast } from 'react-toastify';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await fetchProjectsApi(); }
    catch (e) { return rejectWithValue(e.response?.data || e.message); }
  }
);

export const addProject = createAsyncThunk(
  'projects/add',
  async (payload, { rejectWithValue }) => {
    try { return await createProjectApi(payload); }
    catch (e) { return rejectWithValue(e.response?.data || e.message); }
  }
);

export const editProject = createAsyncThunk(
  'projects/edit',
  async ({ id, data }, { rejectWithValue }) => {
    try { return await updateProjectApi(id, data); }
    catch (e) { return rejectWithValue(e.response?.data || e.message); }
  }
);

export const removeProject = createAsyncThunk(
  'projects/remove',
  async (id, { rejectWithValue }) => {
    try { await deleteProjectApi(id); return id; }
    catch (e) { return rejectWithValue(e.response?.data || e.message); }
  }
);

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchProjects.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchProjects.fulfilled, (s, { payload }) => {
        s.status = 'succeeded';
        s.items = Array.isArray(payload) ? payload : (payload?.items ?? []);
      })
      .addCase(fetchProjects.rejected, (s, { payload }) => {
        s.status = 'failed'; s.error = payload; toast.error('Failed to load projects');
      })

      // add
      .addCase(addProject.fulfilled, (s, { payload }) => {
        const p = payload ?? {};
        const id = p.id ?? p.Id;
        // prepend only if not already there
        if (!s.items.some(x => (x.id ?? x.Id) === id)) s.items.unshift(p);
        toast.success('Project created');
      })
      .addCase(addProject.rejected, (s, { payload }) => {
        s.error = payload; toast.error('Create project failed');
      })

      // edit
      .addCase(editProject.fulfilled, (s, { payload }) => {
        const updated = payload ?? {};
        const id = updated.id ?? updated.Id;
        const idx = s.items.findIndex(x => (x.id ?? x.Id) === id);
        if (idx >= 0) s.items[idx] = { ...s.items[idx], ...updated };
        toast.success('Project updated');
      })
      // .addCase(editProject.rejected, (s, { payload }) => {
      //   s.error = payload; toast.error('Update project failed');
      // })

      // delete
      .addCase(removeProject.fulfilled, (s, { payload: id }) => {
        s.items = s.items.filter(x => (x.id ?? x.Id) !== id);
        toast.info('Project deleted');
      })
      .addCase(removeProject.rejected, (s, { payload }) => {
        s.error = payload; toast.error('Delete project failed');
      });
  }
});

export const selectProjects = (state) => state.projects;
export default slice.reducer;
