import instance, { get, post, del as delReq } from './api';

// Try a list of requests; skip 404 (not found) and 405 (method not allowed)
const tryFirst = async (factories, label = 'request') => {
  let lastErr;
  for (const make of factories) {
    try {
      const { desc, fn } = typeof make === 'function' ? { desc: '', fn: make } : make;
      const res = await fn();
      if (desc) console.log(`[comments] matched: ${label} -> ${desc}`);
      return res;
    } catch (e) {
      const s = e?.response?.status;
      lastErr = e;
      if (s !== 404 && s !== 405) throw e; // keep trying only for 404/405
    }
  }
  throw lastErr;
};

const buildCommentBody = ({ taskId, text, projectId }) => {
  const tid = Number(taskId) || taskId;
  const pid = projectId ? (Number(projectId) || projectId) : undefined;

  return {
    // ids (both casings)
    taskId: tid, TaskId: tid,
    ...(pid !== undefined ? { projectId: pid, ProjectId: pid } : {}),

    // text/content (all common names)
    text, content: text, body: text,
    Text: text, Content: text, Body: text,
  };
};

export const getComments = (taskId) =>
  tryFirst(
    [
      { desc: `/api/Tasks/${taskId}/Comments (GET)`, fn: () => get(`/api/Tasks/${taskId}/Comments`) },
      { desc: `/api/Comments?taskId=${taskId} (GET)`, fn: () => get(`/api/Comments?taskId=${taskId}`) },
      { desc: `/api/Comments/task/${taskId} (GET)`, fn: () => get(`/api/Comments/task/${taskId}`) },
    ],
    'getComments'
  );

export const addComment = ({ taskId, text, projectId }) => {
  const body = buildCommentBody({ taskId, text, projectId });
  return tryFirst(
    [
      { desc: `/api/Tasks/${taskId}/Comments (POST)`, fn: () => post(`/api/Tasks/${taskId}/Comments`, body) },
      { desc: `/api/Tasks/${taskId}/Comments/Add (POST)`, fn: () => post(`/api/Tasks/${taskId}/Comments/Add`, body) },
      { desc: `/api/Comments (POST)`, fn: () => post(`/api/Comments`, body) },
      { desc: `/api/Comments/Add (POST)`, fn: () => post(`/api/Comments/Add`, body) },
      { desc: `/api/TaskComments (POST)`, fn: () => post(`/api/TaskComments`, body) },
    ],
    'addComment'
  );
};

export const deleteComment = (commentId) =>
  tryFirst(
    [
      { desc: `/api/Comments/${commentId} (DELETE)`, fn: () => delReq(`/api/Comments/${commentId}`) },
      { desc: `/api/Comments/Delete/${commentId} (DELETE)`, fn: () => delReq(`/api/Comments/Delete/${commentId}`) },
    ],
    'deleteComment'
  );
