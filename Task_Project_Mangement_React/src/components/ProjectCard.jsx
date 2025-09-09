// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard.css';

const ProjectCard = ({ p, onEdit, onDelete, hideActions }) => {
  const todo = p?.Tasks?.filter(t => t.Status === "ToDo" || t.status === "ToDo").length || 0;
  const doing = p?.Tasks?.filter(t => t.Status === "Doing" || t.status === "Doing").length || 0;
  const done = p?.Tasks?.filter(t => t.Status === "Done" || t.status === "Done").length || 0;

  return (
    <div className="projectcard-bg">
      <Link to={`/projects/${p.id ?? p.Id}`} className="projectcard-title">
        {p.name ?? p.Name}
      </Link>
      <div className="projectcard-meta">
        <span className="projectcard-badge">Description: {p.description ?? p.Description ?? '—'}</span>
        { console.log(p)}
      </div>
      {!hideActions && (
        <div className="projectcard-meta">
          <span className="projectcard-badge">To-Do Tasks: {todo}</span>
          <span className="projectcard-badge">Doing Tasks: {doing}</span>
          <span className="projectcard-badge">Done Tasks: {done}</span>
        </div>
      )}
      {!hideActions && (
        <div className="projectcard-actions">
          <button className="projectcard-btn" onClick={()=>onEdit?.(p)}>Edit</button>
          <button className="projectcard-btn" style={{ background:'#ef4444', color:'#fff' }} onClick={()=>onDelete?.(p)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
