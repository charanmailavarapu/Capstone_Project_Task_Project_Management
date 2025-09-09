// src/components/ProjectForm.jsx
import React, { useEffect, useState } from 'react';
import './ProjectForm.css';

const ProjectForm = ({ initial = {}, onSubmit, submitting }) => {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setName(initial?.name ?? initial?.Name ?? '');
    setOwnerName(initial?.ownerName ?? initial?.OwnerName ?? '');
    setDescription(initial?.description ?? initial?.Description ?? '');
  }, [initial]);

  const handle = (e) => {
    e.preventDefault();
    onSubmit?.({ name, ownerName, description });
  };

  return (
    <form onSubmit={handle} className="projectform-bg">
      <div className="form-row">
        <label className="projectform-label">Name</label>
        <input className="projectform-input" value={name} onChange={(e)=>setName(e.target.value)} required placeholder="Project name" />
      </div>

      <div className="form-row">
        <label className="projectform-label">Owner</label>
        <input className="projectform-input" value={ownerName} onChange={(e)=>setOwnerName(e.target.value)} placeholder="Owner (optional)" />
      </div>

      <div className="form-row">
        <label className="projectform-label">Description</label>
        <textarea rows={3} className="projectform-input" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Short description (optional)"/>
      </div>

      <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:12}}>
        <button type="submit" className="projectform-btn" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
