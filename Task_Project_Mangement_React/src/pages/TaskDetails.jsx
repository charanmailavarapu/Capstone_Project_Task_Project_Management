// src/pages/TaskDetails.jsx
import React, { useEffect, useState } from 'react';
import './TaskDetails.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchTaskComments,
  postTaskComment,
  fetchTaskAttachments,
  postTaskAttachment,
  selectTasks
} from '../redux/slices/tasksSlice';
import { toast } from 'react-toastify';

const Tab = { COMMENTS: 'comments', FILES: 'files' };

export default function TaskDetails() {
  const { id } = useParams();
  const taskId = Number(id);
  const navigate = useNavigate();
  const dispatch  = useDispatch();
  const location = useLocation();
  const projectId = location.state?.projectId;

  const { commentsByTask, attachmentsByTask } = useSelector(selectTasks);
  const comments = commentsByTask[taskId] || [];
  const files    = attachmentsByTask[taskId] || [];

  const [tab, setTab] = useState(Tab.COMMENTS);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchTaskComments(taskId));
    dispatch(fetchTaskAttachments(taskId));
  }, [dispatch, taskId]);

  const postComment = async () => {
    if (!text.trim()) return;
    try {
      await dispatch(postTaskComment({ taskId, content: text.trim() })).unwrap();
      setText('');
    } catch (e) {
      toast.error('Failed to post comment');
    }
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await dispatch(postTaskAttachment({ taskId, file })).unwrap();
    } catch (err) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="taskdetails-bg">
      <div className="taskdetails-container">
        <div className="taskdetails-header">
          <h2 className="taskdetails-title">Task</h2>
          <button className="taskdetails-btn" onClick={() => navigate(-1)}>Back</button>
        </div>

        <div className="taskdetails-meta">
          <button className={`taskdetails-btn${tab===Tab.COMMENTS?' taskdetails-btn-active':''}`} onClick={()=>setTab(Tab.COMMENTS)}>Comments</button>
          <button className={`taskdetails-btn${tab===Tab.FILES?' taskdetails-btn-active':''}`} onClick={()=>setTab(Tab.FILES)}>Attachments</button>
        </div>

        {tab === Tab.COMMENTS && (
          <div className="taskdetails-comments">
            <div className="taskdetails-actions">
              <input
                className="taskdetails-desc"
                placeholder="Write a comment…"
                value={text}
                onChange={e=>setText(e.target.value)}
              />
              <button className="taskdetails-btn" onClick={postComment}>Post</button>
            </div>

            <div>
              {comments.length === 0 && <div className="taskdetails-desc">No comments yet.</div>}
              {comments.map((c) => (
                <div key={c.id ?? c.Id} className="taskdetails-comments">
                  <div className="taskdetails-desc">{c.content ?? c.Content}</div>
                  <div className="taskdetails-badge">
                    {c.authorName ?? c.AuthorName ?? 'Someone'} • {new Date(c.createdAt ?? c.CreatedAt ?? Date.now()).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === Tab.FILES && (
          <div className="taskdetails-comments">
            <div className="taskdetails-actions">
              <label className="taskdetails-btn" style={{ cursor:'pointer' }}>
                {uploading ? 'Uploading…' : 'Upload file'}
                <input type="file" onChange={onUpload} hidden disabled={uploading} />
              </label>
            </div>

            <div>
              {files.length === 0 && <div className="taskdetails-desc">No attachments yet.</div>}
              {files.map((f) => {
                const name = f.fileName ?? f.FileName ?? f.name ?? 'File';
                const url  = f.url ?? f.Url ?? f.downloadUrl ?? '#';
                return (
                  <div key={f.id ?? f.Id} className="taskdetails-comments">
                    <a href={url} target="_blank" rel="noreferrer">{name}</a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
