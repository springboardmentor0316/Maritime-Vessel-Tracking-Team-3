import React, { useState } from 'react';
import VesselMap from './components/VesselMap';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  // --- 1. STATE DEFINITIONS ---
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [view, setView] = useState('login'); 
  const [activeModule, setActiveModule] = useState('vessels');
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Role tracking for RBAC requirements
  const [userRole] = useState(localStorage.getItem('user_role') || 'operator');

  // --- 2. LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setView('login');
  };

  // --- 3. AUTHENTICATION GUARD ---
  if (!token) {
    return view === 'login' ? (
      <Login setToken={setToken} setView={setView} />
    ) : (
      <Register setView={setView} />
    );
  }

  // --- 4. MAIN DASHBOARD LAYOUT ---
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* --- COMMAND CENTER HEADER --- */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            style={hamburgerButtonStyle}
          >
            {isSidebarOpen ? '✕' : '☰'}
          </button>
          <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', letterSpacing: '1.5px' }}>
            MARITIME <span style={{ color: '#3b82f6' }}>COMMAND</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div style={statusBadge}>● LIVE FEED</div>
           <button onClick={handleLogout} style={logoutButtonStyle}>Sign Out</button>
        </div>
      </header>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* --- DYNAMIC COLLAPSIBLE SIDEBAR --- */}
        <aside style={{ 
          ...sidebarStyle, 
          width: isSidebarOpen ? '300px' : '0px',
          padding: isSidebarOpen ? '25px 15px' : '0px',
          opacity: isSidebarOpen ? 1 : 0,
          pointerEvents: isSidebarOpen ? 'auto' : 'none'
        }}>
          {isSidebarOpen && (
            <>
              <div style={{ marginBottom: '30px' }}>
                <label style={sidebarLabel}>Vessel Intelligence</label>
                <input 
                  type="text" 
                  placeholder="Search MMSI / Name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={searchInputStyle}
                />
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={sectionHeaderStyle}>Fleet Management</p>
                <button onClick={() => setActiveModule('vessels')} style={activeModule === 'vessels' ? activeNavItem : navItem}>
                    🚢 Active Vessels
                </button>
                <button onClick={() => setActiveModule('ports')} style={activeModule === 'ports' ? activeNavItem : navItem}>
                    ⚓ Port Congestion
                </button>

                <p style={sectionHeaderStyle}>Risk & Security</p>
                <button onClick={() => setActiveModule('notifications')} style={activeModule === 'notifications' ? activeNavItem : navItem}>
                    ⚠️ Safety Alerts
                </button>
                <button onClick={() => setActiveModule('piracy')} style={activeModule === 'piracy' ? activeNavItem : navItem}>
                    🛡️ Anti-Piracy Map
                </button>

                {/* ROLE-BASED ACCESS: Insights only for Admins/Analysts */}
                {(userRole === 'admin' || userRole === 'analyst') && (
                  <>
                    <p style={sectionHeaderStyle}>Insights</p>
                    <button onClick={() => setActiveModule('analytics')} style={activeModule === 'analytics' ? activeNavItem : navItem}>
                        📊 Fleet Analytics
                    </button>
                  </>
                )}
              </nav>

              <div style={sidebarFooterStyle}>
                <div style={{ marginBottom: '5px' }}>Terminal ID: <strong>LINK-772</strong></div>
                <div style={{ textTransform: 'capitalize' }}>Role: <strong>{userRole}</strong></div>
              </div>
            </>
          )}
        </aside>

        {/* --- MAIN DISPLAY AREA --- */}
        <main style={{ flex: 1, position: 'relative', background: '#f8fafc', transition: 'margin-left 0.3s' }}>
          {/* THE HANDSHAKE: Passing state to Map */}
          <VesselMap search={searchTerm} activeModule={activeModule} />
        </main>
      </div>
    </div>
  );
}

// --- DESIGN SYSTEM STYLES ---
const headerStyle = { backgroundColor: '#0f172a', padding: '10px 30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000, borderBottom: '1px solid #1e293b' };
const statusBadge = { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '5px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', border: '1px solid #10b981' };
const hamburgerButtonStyle = { background: '#1e293b', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '6px', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sidebarStyle = { backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 900 };
const sidebarLabel = { fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' };
const sectionHeaderStyle = { fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '20px', marginBottom: '5px' };
const searchInputStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#f8fafc' };
const navItem = { padding: '12px 15px', textAlign: 'left', background: 'none', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#475569', fontWeight: '600', fontSize: '0.9rem', transition: '0.2s' };
const activeNavItem = { ...navItem, backgroundColor: '#3b82f6', color: 'white', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' };
const logoutButtonStyle = { background: '#ef4444', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' };
const sidebarFooterStyle = { marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #f1f5f9', fontSize: '0.65rem', color: '#94a3b8' };

export default App;