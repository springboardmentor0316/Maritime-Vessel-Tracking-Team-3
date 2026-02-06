import React, { useState } from 'react';
import VesselMap from './components/VesselMap';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  // 1. Session & Navigation State
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [view, setView] = useState('login'); 
  
  // 2. Dashboard UI State
  const [activeModule, setActiveModule] = useState('vessels'); // Tracks sidebar selection
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);    // Toggles hamburger menu
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setView('login');
  };

  // --- AUTH GATE: Show Login or Register if not authenticated ---
  if (!token) {
    return view === 'login' ? (
      <Login setToken={setToken} setView={setView} />
    ) : (
      <Register setView={setView} />
    );
  }

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* --- PLATFORM HEADER (Top Bar) --- */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            style={hamburgerButtonStyle}
            title="Toggle Menu"
          >
            ☰
          </button>
          <h1 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>
            🚢 MARITIME COMMAND
          </h1>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </header>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* --- COLLAPSIBLE SIDEBAR --- */}
        {isSidebarOpen && (
          <aside style={sidebarStyle}>
            <div style={{ marginBottom: '25px' }}>
              <h3 style={sidebarTitleStyle}>Search Fleet</h3>
              <input 
                type="text" 
                placeholder="Vessel name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={searchInputStyle}
              />
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => setActiveModule('vessels')} 
                style={activeModule === 'vessels' ? activeNavItem : navItem}
              >
                🚢 Active Vessels
              </button>
              <button 
                onClick={() => setActiveModule('ports')} 
                style={activeModule === 'ports' ? activeNavItem : navItem}
              >
                ⚓ Port Congestion
              </button>
              <button 
                onClick={() => setActiveModule('notifications')} 
                style={activeModule === 'notifications' ? activeNavItem : navItem}
              >
                ⚠️ Safety Alerts
              </button>
            </nav>

            <div style={sidebarFooterStyle}>
              <p>Status: <span style={{ color: '#10b981' }}>● Online</span></p>
              <p>Region: Global Operations</p>
            </div>
          </aside>
        )}

        {/* --- MAIN CONTENT AREA (The Map) --- */}
        <main style={{ flex: 1, position: 'relative', background: '#e5e7eb' }}>
          {/* We pass activeModule so the map knows what to show */}
          <VesselMap search={searchTerm} activeModule={activeModule} />
        </main>
      </div>
    </div>
  );
}

// --- Professional Command Center Styles ---
const headerStyle = { 
  backgroundColor: '#0f172a', 
  padding: '12px 25px', 
  color: 'white', 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  zIndex: 1000,
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
};

const hamburgerButtonStyle = { 
  background: 'none', 
  border: 'none', 
  color: 'white', 
  fontSize: '1.6rem', 
  cursor: 'pointer',
  padding: '5px'
};

const sidebarStyle = { 
  width: '280px', 
  backgroundColor: '#f1f5f9', 
  borderRight: '1px solid #cbd5e1', 
  padding: '25px 15px', 
  display: 'flex', 
  flexDirection: 'column',
  transition: 'width 0.3s ease'
};

const sidebarTitleStyle = { fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700' };

const searchInputStyle = { 
  width: '100%', 
  padding: '12px', 
  borderRadius: '8px', 
  border: '1px solid #cbd5e1', 
  fontSize: '0.9rem',
  boxSizing: 'border-box'
};

const navItem = { 
  padding: '14px', 
  textAlign: 'left', 
  background: 'none', 
  border: 'none', 
  borderRadius: '10px', 
  cursor: 'pointer', 
  color: '#334155', 
  fontWeight: '600',
  fontSize: '0.95rem',
  transition: 'all 0.2s'
};

const activeNavItem = { 
  ...navItem, 
  backgroundColor: '#3b82f6', 
  color: 'white',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
};

const logoutButtonStyle = { 
  background: '#ef4444', 
  color: '#fff', 
  border: 'none', 
  padding: '8px 18px', 
  borderRadius: '6px', 
  cursor: 'pointer', 
  fontWeight: 'bold',
  fontSize: '0.85rem'
};

const sidebarFooterStyle = { 
  marginTop: 'auto', 
  paddingTop: '20px', 
  borderTop: '1px solid #cbd5e1', 
  fontSize: '0.75rem', 
  color: '#94a3b8',
  lineHeight: '1.6'
};

export default App;