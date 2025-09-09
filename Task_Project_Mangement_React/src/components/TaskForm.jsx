// src/components/TaskForm.js
import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ initial = {}, onSubmit, submitting }) => {
  const [title, setTitle] = useState(initial.title ?? initial.Title ?? '');
  const [description, setDescription] = useState(initial.description ?? initial.Description ?? '');
  const [assigneeName, setAssigneeName] = useState(initial.assigneeName ?? initial.AssigneeName ?? '');
  const [status, setStatus] = useState(initial.status ?? initial.Status ?? 'ToDo');

  // dueDate (yyyy-MM-dd for input[type=date])
  const initialDue = (() => {
    const v = initial.dueDate ?? initial.DueDate;
    if (!v) return '';
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  })();
  const [dueDate, setDueDate] = useState(initialDue);

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({
      title,
      description,
      assigneeName,
      status,
      dueDate: dueDate || null
    });
  };

  return (
    <form onSubmit={submit} className="taskform-bg">
      <div className="form-row">
        <label className="taskform-label">Title</label>
        <input className="taskform-input" value={title} onChange={(e)=>setTitle(e.target.value)} required placeholder="Task title" />
      </div>

      <div className="form-row">
        <label className="taskform-label">Assignee</label>
        <input className="taskform-input" value={assigneeName} onChange={(e)=>setAssigneeName(e.target.value)} placeholder="Assignee (optional)" />
      </div>

      <div className="form-row">
        <label className="taskform-label">Due Date</label>
        <input className="taskform-input" type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)} />
      </div>

      <div className="form-row">
        <label className="taskform-label">Description</label>
        <textarea rows={3} className="taskform-input" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Short description (optional)"/>
      </div>

      <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:12}}>
        <button type="submit" className="taskform-btn" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
};
export default TaskForm;
