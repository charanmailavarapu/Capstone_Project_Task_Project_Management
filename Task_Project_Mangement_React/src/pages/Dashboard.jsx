
import React, { useEffect } from 'react';
import './Dashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, selectProjects } from '../redux/slices/projectsSlice';
import { selectAuth } from '../redux/slices/authSlice';
import ProjectCard from '../components/ProjectCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(selectProjects);
  const { user } = useSelector(selectAuth);
  const name = user?.fullName || user?.name || user?.email || 'User';
  const role = user?.role || user?.Role || 'Admin';

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const localUser = (() => {
    try { return user || JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return user; }
  })();
  

  return (
    <div className="dashboard-bg">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {name}</h1>
            <span>Role: <span className="role-badge">{role}</span></span>
          </div>
          <button
            className="dashboard-create-btn"
            onClick={() => navigate('/projects')}
          >
            + Create Project
          </button>
        </div>

        <div className="dashboard-grid">
          {items.length === 0 ? (
            <div className="dashboard-empty">No projects yet. Start by creating one!</div>
          ) : (
            items.map(p => (
              <div key={p.id ?? p.Id} className="dashboard-card">
                <ProjectCard p={p} hideActions />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
