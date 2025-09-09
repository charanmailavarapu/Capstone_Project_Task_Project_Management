// src/Services/projectService.js
import { get, post, put, del } from './api';

/**
 * Some backends expose /api/Projects, some /api/Project, some even /create endpoints.
 * We try a few fallbacks to avoid “404/405” surprises without touching your backend.
 */
const CREATE_PATHS = [
  '/api/Projects',
  '/api/Project',
  '/api/Projects/create',
  '/api/Project/create',
  '/Projects',
  '/Project',
];

const UPDATE_PATHS = (id) => [
  `/api/Projects/${id}`,
  `/api/Project/${id}`,
  `/Projects/${id}`,
  `/Project/${id}`,
];

const DELETE_PATHS = (id) => [
  `/api/Projects/${id}`,
  `/api/Project/${id}`,
  `/Projects/${id}`,
  `/Project/${id}`,
];

const LIST_PATHS = [
  '/api/Projects',
  '/Projects',
];

const okData = (r) => r?.data ?? r;

/** --- Helpers that try several endpoints --- **/
async function tryPost(paths, body) {
  let lastErr;
  for (const p of paths) {
    try { return okData(await post(p, body)); }
    catch (e) {
      const status = e?.response?.status;
      // if 404 or 405 try the next path; other errors bubble
      if (status !== 404 && status !== 405) throw e;
      lastErr = e;
    }
  }
  throw lastErr;
}

async function tryPut(paths, body) {
  let lastErr;
  for (const p of paths) {
    try { return okData(await put(p, body)); }
    catch (e) {
      const status = e?.response?.status;
      if (status !== 404 && status !== 405) throw e;
      lastErr = e;
    }
  }
  throw lastErr;
}

async function tryDelete(paths) {
  let lastErr;
  for (const p of paths) {
    try { return okData(await del(p)); }
    catch (e) {
      const status = e?.response?.status;
      if (status !== 404 && status !== 405) throw e;
      lastErr = e;
    }
  }
  throw lastErr;
}

/** --- Public API --- **/
export async function fetchProjectsApi() {
  // Use only the provided endpoint
  try {
    return okData(await get('/api/Projects'));
  } catch (e) {
    throw e;
  }
}

export async function createProjectApi({ name, description }) {
  // Send only PascalCase fields for backend compatibility
  const body = {
    Name: name,
    Description: description,
  };
  try {
    return await tryPost(CREATE_PATHS, body);
  } catch (err) {
    throw err;
  }
}

export async function updateProjectApi(id, { name, description }) {
  const body = {
    id,
    name,
    description,
    Id: id,
    Name: name,
    Description: description,
  };
  return tryPut(UPDATE_PATHS(id), body);
}

export async function deleteProjectApi(id) {
  return tryDelete(DELETE_PATHS(id));
}
