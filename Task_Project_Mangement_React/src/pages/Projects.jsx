// src/pages/Projects.jsx
import React, { useEffect, useState } from 'react';
import './Projects.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjects,
  selectProjects,
  addProject,
  editProject,
  removeProject,
} from '../redux/slices/projectsSlice';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import LogoutButton from '../components/LogoutButton';

const Projects = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector(selectProjects);
  // Get user role from localStorage
  const role = localStorage.getItem('tpm.user.role') || '';

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const canModify = true;

  const goToBoard = (id) => {
    window.location.href = `/projects/${id}`;
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name ?? p.Name ?? '',
      description: p.description ?? p.Description ?? '',
    });
    setOpen(true);
  };

  const onDelete = async (id) => {
    console.log('Delete button clicked, id:', id);
    if (!window.confirm('Delete this project?')) return;
    console.log('Dispatching removeProject');
    try {
      await dispatch(removeProject(id));
    } catch (err) {
      if (err?.response?.status === 403) {
        toast.error('User Denied');
      }
    }
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (!form.name?.trim()) {
      toast.info('Project name is required and cannot be empty.');
      return;
    }

    // Check for token before making API call
    const token = localStorage.getItem('tpm.token');
    if (!token) {
      toast.error('You are not logged in. Please log in to create a project.');
      setOpen(false);
      return;
    }

    if (!canModify) {
      toast.error('You do not have permission to modify projects.');
      setOpen(false);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
      };
      console.log('Creating project with payload:', payload);
      if (editing) {
        const id = editing.id ?? editing.Id;
        const result = await dispatch(editProject({ id, data: payload })).unwrap();
        console.log('Edit project result:', result);
      } else {
        const result = await dispatch(addProject(payload)).unwrap();
        console.log('Create project result:', result);
      }
      setOpen(false);
    } catch (err) {
      if (err?.response?.status === 403) {
        toast.error('User Denied');
      } else {
        console.error('Project creation error:', err);
        // toast.error(err?.message || 'Failed to create project. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="projects-bg">
      <div className="projects-container">
        <div className="projects-header">
          <h2>Projects</h2>
          {canModify && (
            <button
              className="projects-create-btn"
              onClick={openCreate}
            >
              + Add New Project
            </button>
          )}
        </div>
        {status === 'loading' ? (
          <p className="projects-loading">Loading…</p>
        ) : (
          <div className="projects-grid">
            {items.length === 0 ? (
              <div className="projects-empty">No projects yet. {canModify ? 'Start by creating one!' : 'Contact your manager to create a project.'}</div>
            ) : (
              items.map((p) => {
                console.log('Rendering project:', p);
                const id = p.id ?? p.Id;
                const key = id ?? p.name ?? p.Name;
                const title = p.name ?? p.Name ?? 'Untitled';
                const desc = p.description ?? p.Description ?? '';
                const todo = p.stats?.todo ?? p.Stats?.Todo ?? 0;
                const doing = p.stats?.doing ?? p.Stats?.Doing ?? 0;
                const done = p.stats?.done ?? p.Stats?.Done ?? 0;
                return (
                  <article key={key} className="projects-card">
                    <header>
                      <h3>{title}</h3>
                      {canModify && (
                        <div className="card-actions">
                          <button onClick={(e)=>{ e.stopPropagation(); openEdit(p); }} title="Edit project">Edit</button>
                          <button onClick={(e)=>{ e.stopPropagation(); onDelete(id); }} title="Delete project">Delete</button>
                        </div>
                      )}
                    </header>
                    <p title={desc || '—'}>{desc || '—'}</p>
                    <div className="project-stats">
                      <span>ToDo {todo}</span>
                      <span>Doing {doing}</span>
                      <span>Done {done}</span>
                    </div>
                    <button className="board-btn" onClick={()=>goToBoard(id)} title="Open Board">
                      Open Board
                    </button>
                  </article>
                );
              })
            )}
          </div>
        )}
        <Modal open={open} onClose={()=>setOpen(false)} title={editing ? 'Edit Project' : 'Create Project'}>
          <form onSubmit={submit}>
            <div className="projects-modal">
              <label>Name</label>
              <input
                className="projects-input"
                placeholder="Project name"
                value={form.name}
                onChange={e=>setForm(f=>({ ...f, name:e.target.value }))}
                autoFocus
                disabled={!canModify}
              />
              <label>Description</label>
              <textarea
                className="projects-input"
                rows={3}
                placeholder="Optional description"
                value={form.description}
                onChange={e=>setForm(f=>({ ...f, description:e.target.value }))}
                disabled={!canModify}
              />
              <div className="modal-actions">
                <button type="button" onClick={()=>setOpen(false)}>Cancel</button>
                <button type="submit" disabled={submitting || !canModify}>
                  {submitting ? 'Saving…' : (editing ? 'Save Changes' : 'Create')}
                </button>
              </div>
              {!canModify && (
                <div className="projects-permission-msg">You do not have permission to modify projects.</div>
              )}
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Projects;
