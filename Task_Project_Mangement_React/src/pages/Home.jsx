import React from 'react';
import './Home.css';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('tpm.user'));
  const fullName = user?.fullName || user?.name || "User";
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'Admin' || user?.Role === 'Admin';

  return (
  <div className="home-bg" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1976d2 0%, #0052cc 100%)' }}>
      {/* HERO SECTION */}
      <div className="home-container" style={{ maxWidth: 900, margin: '0 auto', paddingTop: 48, textAlign: 'center', background: 'rgba(255,255,255,0.98)', borderRadius: 20, boxShadow: '0 4px 32px #0052cc33', color: '#222' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1976d2', fontWeight: 800, fontSize: 32, letterSpacing: 1 }}>Welcome, {fullName}!</h2>
        <h1 style={{ fontWeight: 900, fontSize: 44, color: '#0052cc', marginBottom: 18, letterSpacing: 1 }}>TPM — Organize work. Ship faster.</h1>
        <p style={{ fontSize: 22, color: '#333', marginBottom: 22, fontWeight: 500 }}>
          A lightweight Trello-style board for teams that want clarity without the clutter.<br />
          Organize projects, move cards, and collaborate visually — all in one place.
        </p>
        <div style={{ fontSize: 18, color: '#1976d2', marginBottom: 36, fontWeight: 600 }}>Simple. Fast. Built for teams.</div>
        {!isLoggedIn && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 36 }}>
            <button className="home-btn" style={{ background: '#1976d2', color: '#fff', fontWeight: 700, borderRadius: 10, padding: '14px 36px', fontSize: 20, border: 'none', boxShadow: '0 2px 12px #1976d233', cursor: 'pointer', letterSpacing: 1 }} onClick={() => window.location.href = '/login'}>Login</button>
            <button className="home-btn" style={{ background: '#fff', color: '#1976d2', fontWeight: 700, borderRadius: 10, padding: '14px 36px', fontSize: 20, border: '2px solid #1976d2', boxShadow: '0 2px 12px #1976d233', cursor: 'pointer', letterSpacing: 1 }} onClick={() => window.location.href = '/register'}>Register</button>
          </div>
        )}
      </div>

      {/* FEATURE HIGHLIGHTS */}
      <section className="home-features" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0', display: 'grid', gridTemplateColumns: isAdmin ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: 36, background: 'rgba(25, 118, 210, 0.12)', borderRadius: 20 }}>
        <article className="home-feature-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #1976d211', padding: 32, textAlign: 'center', color: '#222' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🧩</div>
          <h3 className="home-feature-title" style={{ fontWeight: 700, fontSize: 20 }}>Drag & drop cards</h3>
          <p className="home-feature-desc" style={{ color: '#555' }}>Move cards between lists with smooth, intuitive drag and drop.</p>
        </article>
        <article className="home-feature-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #1976d211', padding: 32, textAlign: 'center', color: '#222' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <h3 className="home-feature-title" style={{ fontWeight: 700, fontSize: 20 }}>Trello boards</h3>
          <p className="home-feature-desc" style={{ color: '#555' }}>Create boards for each project or team and track To-Do, Doing & Done at a glance.</p>
        </article>
        <article className="home-feature-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #1976d211', padding: 32, textAlign: 'center', color: '#222' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
          <h3 className="home-feature-title" style={{ fontWeight: 700, fontSize: 20 }}>Task comments</h3>
          <p className="home-feature-desc" style={{ color: '#555' }}>Discuss work right on the card. Keep decisions close to the work.</p>
        </article>
        {isAdmin && (
          <article className="home-feature-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #1976d211', padding: 32, textAlign: 'center', color: '#222', opacity: 1 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
            <h3 className="home-feature-title" style={{ fontWeight: 700, fontSize: 20 }}>Role-based access</h3>
            <p className="home-feature-desc" style={{ color: '#555' }}>Admin & User roles keep data safe and permissions simple.</p>
          </article>
        )}
      </section>

      {/* HOW IT WORKS */}
  <section className="home-container" style={{ maxWidth: 900, margin: '0 auto', marginTop: 40, background: 'rgba(255,255,255,0.98)', borderRadius: 20, boxShadow: '0 2px 16px #0052cc22', padding: 40, color: '#222' }}>
  <h2 className="home-title" style={{ fontSize: 28, fontWeight: 800, marginBottom: 22, color: '#1976d2', letterSpacing: 1 }}>How it works</h2>
  <ol className="home-feature-card" style={{ display: 'grid', gap: 18, fontSize: 20, color: '#333', margin: 0, padding: 0, listStyle: 'none' }}>
          <li><span className="role-badge" style={{ background: '#1976d2', color: '#fff', borderRadius: 8, padding: '4px 14px', marginRight: 12, fontWeight: 700 }}>1</span> Create or pick a board</li>
          <li><span className="role-badge" style={{ background: '#f7b500', color: '#fff', borderRadius: 8, padding: '4px 14px', marginRight: 12, fontWeight: 700 }}>2</span> Add cards under To-Do</li>
          <li><span className="role-badge" style={{ background: '#36b37e', color: '#fff', borderRadius: 8, padding: '4px 14px', marginRight: 12, fontWeight: 700 }}>3</span> Drag cards across lists</li>
          <li><span className="role-badge" style={{ background: '#0052cc', color: '#fff', borderRadius: 8, padding: '4px 14px', marginRight: 12, fontWeight: 700 }}>4</span> Comment, assign & deliver</li>
        </ol>
      </section>

      {/* FOOTER */}
  <footer className="home-container home-footer" style={{ maxWidth: 900, margin: '48px auto 0', textAlign: 'center', color: '#fff', fontSize: 15, background: '#1976d2', borderRadius: 12, padding: '18px 0' }}>
        <div>© {new Date().getFullYear()} TPM — Trello Clone</div>
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 8 }}>
          <a href="#" className="home-btn" style={{ background: 'none', color: '#0052cc', textDecoration: 'none', fontWeight: 500, padding: 0 }} onClick={(e)=>e.preventDefault()}>Privacy</a>
          <a href="#" className="home-btn" style={{ background: 'none', color: '#0052cc', textDecoration: 'none', fontWeight: 500, padding: 0 }} onClick={(e)=>e.preventDefault()}>Terms</a>
          <a href="#" className="home-btn" style={{ background: 'none', color: '#0052cc', textDecoration: 'none', fontWeight: 500, padding: 0 }} onClick={(e)=>e.preventDefault()}>Status</a>
        </div>
      </footer>
    </div>
  );
}
export default Home;
