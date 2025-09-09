import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../Services/taskService';
import { addComment } from '../../Services/commentService';
import { toast } from 'react-toastify';

const initialState = {
  byProject: {},               
  commentsByTask: {},          
  attachmentsByTask: {},       
  status: 'idle',
  error: null,
  selectedTaskId: null,
};

// ---------- Tasks ----------
export const fetchProjectTasks = createAsyncThunk(
  'tasks/fetchProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const items = await api.getTasksByProject(projectId);
      return { projectId, items };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      return { projectId, item: await api.createTask({ ...data, projectId }) };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ projectId, id, data }, { rejectWithValue }) => {
    try {
      return { projectId, item: await api.updateTask(id, data) };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async ({ projectId, id }, { rejectWithValue }) => {
    try {
      await api.deleteTask(id);
      return { projectId, id };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const moveTask = createAsyncThunk(
  'tasks/move',
  async ({ projectId, taskId, to, toIndex }, { rejectWithValue }) => {
    try {
      await api.moveTask({ taskId, status: to, orderIndex: toIndex });
      return { projectId, taskId, to, toIndex };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

// ---------- Comments ----------
export const fetchTaskComments = createAsyncThunk(
  'tasks/fetchComments',
  async (taskId, { rejectWithValue }) => {
    try {
      return { taskId, items: await api.getTaskComments(taskId) };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const postTaskComment = createAsyncThunk(
  'tasks/postComment',
  async ({ taskId, content, projectId }, { rejectWithValue }) => {
    try {
      const created = await addComment({ taskId, text: content, projectId });
      return { taskId, item: created };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

// ---------- Attachments ----------
export const fetchTaskAttachments = createAsyncThunk(
  'tasks/fetchAttachments',
  async (taskId, { rejectWithValue }) => {
    try {
      return { taskId, items: await api.getTaskAttachments(taskId) };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const postTaskAttachment = createAsyncThunk(
  'tasks/postAttachment',
  async ({ taskId, file }, { rejectWithValue }) => {
    try {
      const uploaded = await api.uploadAttachment({ taskId, file });
      return { taskId, item: uploaded };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    selectTask(state, action) { state.selectedTaskId = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      // ----- fetch project tasks -----
      .addCase(fetchProjectTasks.pending, (s) => { s.status = 'loading'; })
      .addCase(fetchProjectTasks.fulfilled, (s, { payload }) => {
        s.status = 'succeeded';
        s.byProject[payload.projectId] = payload.items || [];
      })
      .addCase(fetchProjectTasks.rejected, (s, { payload }) => { s.status = 'failed'; s.error = payload; })

      // ----- create -----
      .addCase(createTask.fulfilled, (s, { payload }) => {
        const pid = payload.projectId;
        if (!s.byProject[pid]) s.byProject[pid] = [];
        s.byProject[pid].unshift(payload.item);
        toast.success('Task created');
      })

      // ----- update -----
      .addCase(updateTask.fulfilled, (s, { payload }) => {
        const pid = payload.projectId;
        if (!s.byProject[pid]) s.byProject[pid] = [];
        const rows = s.byProject[pid];
        const id = payload.item.id ?? payload.item.Id;
        const idx = rows.findIndex(t => String(t.id ?? t.Id) === String(id));
        if (idx >= 0) rows[idx] = payload.item;
        toast.success('Task updated');
      })

      // ----- delete (optimistic) -----
      .addCase(deleteTask.pending, (s, { meta }) => {
        const { projectId, id } = meta.arg || {};
        const rows = s.byProject[projectId] || [];
        s.byProject[projectId] = rows.filter(t => String(t.id ?? t.Id) !== String(id));
      })
      .addCase(deleteTask.fulfilled, () => {
        toast.success('Task deleted');
      })
      .addCase(deleteTask.rejected, (s, { payload }) => {
        toast.error(payload || 'Failed to delete');
      })

      // ----- move -----
      .addCase(moveTask.fulfilled, (s, { payload }) => {
        const pid = payload.projectId;
        const rows = s.byProject[pid] || [];
        const idx = rows.findIndex(t => String(t.id ?? t.Id) === String(payload.taskId));
        if (idx >= 0) rows[idx].status = payload.to;
        toast.success('Task moved');
      })

      // ----- comments -----
      .addCase(fetchTaskComments.fulfilled, (s, { payload }) => {
        s.commentsByTask[payload.taskId] = payload.items || [];
      })
      .addCase(postTaskComment.fulfilled, (s, { payload }) => {
        const list = s.commentsByTask[payload.taskId] || [];
        list.push(payload.item);
        s.commentsByTask[payload.taskId] = list;
      })

      // ----- attachments -----
      .addCase(fetchTaskAttachments.fulfilled, (s, { payload }) => {
        s.attachmentsByTask[payload.taskId] = payload.items || [];
      })
      .addCase(postTaskAttachment.fulfilled, (s, { payload }) => {
        const list = s.attachmentsByTask[payload.taskId] || [];
        list.push(payload.item);
        s.attachmentsByTask[payload.taskId] = list;
      });
  }
});

export const { selectTask } = slice.actions;
export const selectTasks = (state) => state.tasks;
export default slice.reducer;
