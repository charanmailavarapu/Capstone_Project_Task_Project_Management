import React, { useEffect, useState } from 'react';
import { getComments, addComment, deleteComment } from '../Services/commentService';
import { toast } from 'react-toastify';

const CommentsPanel = ({ taskId, onClose }) => {
  const [rows, setRows] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    if (!taskId) { setRows([]); return; }
    setLoading(true); setError('');
    try {
      const data = await getComments(taskId);
      setRows(Array.isArray(data) ? data : (data?.items ?? []));
    } catch (e) {
      const msg =
        e?.response?.data?.title ||
        e?.response?.data?.message ||
        e?.message ||
        'Failed to load comments';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [taskId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setPosting(true); setError('');
    try {
      await addComment({ taskId, text });
      setText('');
      await load();
      toast.success('Comment added');
    } catch (e) {
      const msg =
        e?.response?.data?.title ||
        e?.response?.data?.message ||
        e?.response?.data?.errors && Object.values(e.response.data.errors).flat().join(' ') ||
        e?.message ||
        'Failed to add comment';
      setError(msg);
      toast.error(msg);
    } finally {
      setPosting(false);
    }
  };

  const remove = async (id) => {
    if (!id) return;
    const ok = window.confirm('Delete this comment?');
    if (!ok) return;
    try {
      await deleteComment(id);
      await load();
      toast.info('Comment deleted');
    } catch (e) {
      const msg = e?.response?.data?.title || e?.response?.data?.message || e?.message || 'Delete failed';
      toast.error(msg);
    }
  };

  if (!taskId) return null;

  return (
    <div className="card">
      <div className="toolbar" style={{ marginBottom: 12 }}>
        <h3 className="page-title" style={{ fontSize: 16, margin: 0 }}>Comments</h3>
        {onClose && <button className="btn btn-sm" onClick={onClose}>Close</button>}
      </div>

      {loading ? <div className="muted">Loading…</div> : null}
      {error ? <div className="muted" style={{ color: '#fca5a5' }}>{error}</div> : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {rows.map((c) => (
          <div key={c.id ?? c.Id} className="kb-item" style={{ padding: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {c.content ?? c.Content ?? c.body ?? c.Body ?? c.text ?? ''}
              </div>
              <button className="btn btn-sm danger" onClick={() => remove(c.id ?? c.Id)}>Delete</button>
            </div>
          </div>
        ))}
        {rows.length === 0 && !loading && <div className="muted">No comments yet.</div>}
      </div>

      <form onSubmit={submit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Write a comment…"
          className="input"
          style={{
            width: '100%',
            resize: 'vertical',
            background: 'rgba(2,6,23,.35)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            borderRadius: 10,
            padding: 10
          }}
        />
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn" type="button" onClick={() => setText('')} disabled={posting}>Clear</button>
          <button className="btn btn-primary" type="submit" disabled={posting}>
            {posting ? 'Posting…' : 'Add Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentsPanel;
