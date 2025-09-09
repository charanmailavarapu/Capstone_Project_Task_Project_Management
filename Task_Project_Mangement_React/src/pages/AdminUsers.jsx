import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/slices/authSlice';
import './AdminUsers.css';
import RoleGuard from '../components/RoleGuard';
import { fetchProjectsApi } from '../Services/projectService';

const AdminUsers = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector(selectAuth);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await fetchProjectsApi();
        const items = Array.isArray(data) ? data : (data.items ?? []);
        setProjects(items);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects');
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <RoleGuard roles={['Admin']}>
      <div className="admin-bg">
        <div className="admin-container">
          <div className="admin-header">
            <h2 className="admin-title">Admin — Projects</h2>
            <span className="admin-role-badge">Admin Only</span>
          </div>
          <div style={{ marginBottom: 16, fontSize: 14, color: '#1976d2', background: '#e3f0ff', padding: 8, borderRadius: 6 }}>
            <strong>Debug:</strong> Current user: {user?.fullName ?? user?.email ?? '-'} | Role: {user?.role ?? user?.Role ?? '-'}
          </div>
          <div className="admin-card">
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0' }}>
                <div className="spinner" style={{ width: 48, height: 48, border: '6px solid #e3f0ff', borderTop: '6px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 }}></div>
                <div style={{ fontWeight: 600, color: '#1976d2' }}>Loading projects…</div>
              </div>
            ) : error ? (
              <div style={{ color: 'red', fontWeight: 700, fontSize: 18, margin: '24px 0' }}>{error}</div>
            ) : (
              <>
                <div style={{ fontWeight: 600, marginBottom: 12 }}>
                  Total Projects: {projects.length}
                </div>
                <table className="admin-users-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                  <thead>
                    <tr style={{ background: '#f0f4fa' }}>
                      <th style={{ padding: '8px', border: '1px solid #e3e3e3' }}>Id</th>
                      <th style={{ padding: '8px', border: '1px solid #e3e3e3' }}>Name</th>
                      <th style={{ padding: '8px', border: '1px solid #e3e3e3' }}>Description</th>
                      <th style={{ padding: '8px', border: '1px solid #e3e3e3' }}>CreatedById</th>
                      <th style={{ padding: '8px', border: '1px solid #e3e3e3' }}>CreatedAt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.Id ?? p.id}>
                        <td style={{ padding: '8px', border: '1px solid #e3e3e3' }}>{p.Id ?? p.id}</td>
                        <td style={{ padding: '8px', border: '1px solid #e3e3e3' }}>{p.Name ?? p.name}</td>
                        <td style={{ padding: '8px', border: '1px solid #e3e3e3' }}>{p.Description ?? p.description}</td>
                        <td style={{ padding: '8px', border: '1px solid #e3e3e3' }}>{p.CreatedById ?? '-'}</td>
                        <td style={{ padding: '8px', border: '1px solid #e3e3e3' }}>{p.CreatedAt ? new Date(p.CreatedAt).toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default AdminUsers;