import React, { useState } from 'react';
import VesselMap from './components/VesselMap';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  // Milestone 1: State to manage the security token [cite: 27]
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  
  // State to toggle between Login and Register views [cite: 27]
  const [view, setView] = useState('login'); 
  
  // Milestone 2: State for vessel search and filtering [cite: 31]
  const [searchTerm, setSearchTerm] = useState("");

  // Milestone 1: Logout logic to clear session [cite: 27]
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  // AUTH GATE: If no token is found, toggle between Login and Register components 
  if (!token) {
    return view === 'login' ? 
      <Login setToken={setToken} setView={setView} /> : 
      <Register setView={setView} />;
  }

  // MAIN PLATFORM: Rendered only after successful authentication [cite: 6, 18]
  return (
    <div className="App" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with platform title and Logout tool [cite: 1, 27] */}
      <header style={{ 
        backgroundColor: '#1a2a3a', 
        padding: '15px 30px', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem' }}>🚢 Maritime Analytics & Safety Platform</h1>
        <button 
          onClick={handleLogout} 
          style={{ 
            background: '#ef4444', 
            color: '#fff', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '6px', 
            fontWeight: 'bold',
            cursor: 'pointer' 
          }}
        >
          Logout
        </button>
      </header>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar for Search and Filtering [cite: 31, 47] */}
        <aside style={{ 
          width: '300px', 
          backgroundColor: '#f8fafc', 
          borderRight: '1px solid #e2e8f0', 
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>Vessel Search</h3>
          <input 
            type="text" 
            placeholder="Search by name (e.g. Titanic 2)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
            <p><strong>Note:</strong> Search results will update the map visualization and voyage history analytics in real-time[cite: 30, 31].</p>
          </div>
        </aside>

        {/* Main Viewport for Map, Analytics, and Safety Overlays [cite: 6, 32, 35] */}
        <main style={{ flex: 1, background: '#f1f5f9', overflowY: 'auto' }}>
          <VesselMap search={searchTerm} />
        </main>
      </div>
    </div>
  );
}

export default App;