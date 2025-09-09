// src/components/TaskCard.jsx
import React from 'react';
import './TaskCard.css';

const TaskCard = ({ t = {}, users = [], onOpen, onEdit, onDelete }) => {
  // Find assignee name from users list
  const assigneeId = t.assigneeId ?? t.AssigneeId;
  const assignee = users.find(u => String(u.id ?? u.Id) === String(assigneeId));
  const assigneeName = assignee ? (assignee.name ?? assignee.fullName ?? assignee.email) : '—';

  return (
    <div className="taskcard-bg">
      <div className="taskcard-header">
        <span className="taskcard-title" onClick={() => onOpen?.(t)}>{t.title ?? t.Title}</span>
        <span className="taskcard-badge">{t.status ?? t.Status}</span>
      </div>
      <div className="taskcard-desc">{t.description ?? t.Description}</div>
  {/* ...existing code... */}
      <div className="taskcard-actions">
        <button className="taskcard-btn" onClick={() => onEdit?.(t)}>Edit</button>
        <button
          className="taskcard-btn"
          style={{ background:'#ef4444', color:'#fff' }}
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this task?')) {
              onDelete?.(t);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
