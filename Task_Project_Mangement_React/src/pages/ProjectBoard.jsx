// src/pages/ProjectBoard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import './ProjectBoard.css';

import {
  fetchProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  selectTasks,
} from '../redux/slices/tasksSlice';

const COLS = [
  { key: 'ToDo',       title: 'To Do' },
  { key: 'InProgress', title: 'In Progress' },
  { key: 'Done',       title: 'Done' },
];

export default function ProjectBoard() {
  const { id: projectIdParam } = useParams();
  const projectId = Number(projectIdParam);

  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { byProject } = useSelector(selectTasks);

  const tasks = byProject[projectId] || [];

  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchProjectTasks(projectId));
  }, [dispatch, projectId]);

  const colItems = useMemo(() => ({
    ToDo:       tasks.filter(t => (t.status ?? t.Status) === 'ToDo'),
    InProgress: tasks.filter(t => (t.status ?? t.Status) === 'InProgress'),
    Done:       tasks.filter(t => (t.status ?? t.Status) === 'Done'),
  }), [tasks]);

const onDragEnd = async (result) => {
  const { destination, source, draggableId } = result;
  if (!destination) return;

  const from = source.droppableId;
  const to   = destination.droppableId;

  if (from === to && source.index === destination.index) return;

  const id = Number(draggableId);

  const existing = (byProject[projectId] || []).find(
    x => String(x.id ?? x.Id) === String(id)
  );
  if (!existing) return;

  // Build the payload the API expects (full task)
  const payload = {
    title:         existing.title ?? existing.Title ?? '',
    description:   existing.description ?? existing.Description ?? '',
    assigneeName:  existing.assigneeName ?? existing.AssigneeName ?? '',
    dueDate:       existing.dueDate ?? existing.DueDate ?? null,

    status:        to,
    Status:        to,
    orderIndex:    destination.index,
    OrderIndex:    destination.index
  };

  try {
    await dispatch(updateTask({ projectId, id, data: payload })).unwrap();
  } catch (e) {
    toast.error('Failed to move task');
  }
};


  const doCreate = async (data) => {
    try {
      await dispatch(createTask({ projectId, data })).unwrap();
      setCreating(false);
    } catch {}
  };

  const doUpdate = async (data) => {
    const id = editing?.id ?? editing?.Id;
    try {
      await dispatch(updateTask({ projectId, id, data })).unwrap();
      setEditing(null);
    } catch {}
  };

  const doDelete = async (t) => {
    const id = t?.id ?? t?.Id;
    if (!id) return toast.error('Invalid task id');
    try {
      await dispatch(deleteTask({ projectId, id })).unwrap();
    } catch {}
  };

  const openTask = (t) => {
    const id = t?.id ?? t?.Id;
    if (!id) return toast.error('Invalid task id');
    navigate(`/tasks/${id}`);
  };

  return (
    <div className="projectboard-bg">
      <div className="projectboard-container">
        <div className="projectboard-header">
          <img src="/logo.png" alt="Logo" style={{ width: 32, height: 32, marginRight: 12 }} />
          <h2 className="projectboard-title">Project Board</h2>
          <button className="projectboard-btn" onClick={() => setCreating(true)}>
            + Add Task
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="projectboard-board">
            {COLS.map(col => (
              <Droppable droppableId={col.key} key={col.key}>
                {(provided) => (
                  <div
                    className="projectboard-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="projectboard-column-title">{col.title}</div>

                    {(colItems[col.key] || []).map((t, idx) => {
                      const tid = String(t.id ?? t.Id);
                      return (
                        <Draggable draggableId={tid} index={idx} key={tid}>
                          {(prov) => (
                            <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                              <div className="projectboard-task">
                                <TaskCard
                                  t={t}
                                  onOpen={openTask}
                                  onEdit={setEditing}
                                  onDelete={doDelete}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {(creating || editing) && (
          <div className="projectboard-modal">
            <h3 className="projectboard-title" style={{ fontSize: 22 }}>{editing ? 'Edit Task' : 'New Task'}</h3>
            <TaskForm
              initial={editing || {}}
              onSubmit={editing ? doUpdate : doCreate}
            />
            <div style={{ marginTop: 18, textAlign: 'right' }}>
              <button className="projectboard-btn" style={{ background: '#e9ecef', color: '#42526e' }} onClick={() => { setCreating(false); setEditing(null); }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
