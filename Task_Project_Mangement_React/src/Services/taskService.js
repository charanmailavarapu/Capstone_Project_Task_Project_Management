// src/Services/taskService.js
import { get, post, put, del } from './api';

// ---- Tasks ----
export const getTasksByProject = async (projectId) => get(`/api/Tasks/${projectId}`);
export const createTask        = async (data)        => post('/api/Tasks', data);
export const updateTask        = async (id, data)    => put(`/api/Tasks/${id}`, data);
export const moveTask          = async ({ taskId, status, orderIndex }) =>
  put(`/api/Tasks/${taskId}`, { status, orderIndex });
export const deleteTask        = async (id)          => del(`/api/Tasks/${id}`);

// ---- Comments ----
export const getTaskComments   = async (taskId)      => get(`/api/Comments/${taskId}`);
export const createComment     = async ({ taskId, content }) =>
  post('/api/Comments', { taskId, content });

// ---- Attachments ----
export const getTaskAttachments = async (taskId) => get(`/api/Tasks/${taskId}/attachments`);
export const uploadAttachment   = async ({ taskId, file }) => {
  const form = new FormData();
  form.append('file', file);
  return post(`/api/Tasks/${taskId}/attachments`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
