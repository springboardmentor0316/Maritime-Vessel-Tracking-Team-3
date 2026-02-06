import React, { useState } from 'react';
import VesselMap from './components/VesselMap';
import Login from './components/Login';
import './App.css';

function App() {
  // Logic for Milestone 1: Initialize state with the token from localStorage [cite: 27]
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [searchTerm, setSearchTerm] = useState("");

  // Logic for Milestone 1: Logout functionality to clear the session [cite: 27]
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  const role = localStorage.getItem('user_role');
// ... inside return
<VesselMap search={searchTerm} userRole={role} />

  // AUTH GATE: If no token exists, the user must log in first 
  if (!token) {
    return <Login setToken={setToken} />;
  }
  

  return (
    <div className="App">
      {/* Header with Logout for Milestone 1 compliance [cite: 27] */}
      <header style={{ 
        backgroundColor: '#1a2a3a', 
        padding: '15px 30px', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>Maritime Tracking System</h1>
        <button 
          onClick={handleLogout} 
          style={{ 
            background: '#ef4444', 
            color: '#fff', 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </header>
      
      <div style={{ display: 'flex', height: '92vh' }}>
        {/* Sidebar for Search and Filtering - Milestone 2 Requirement  */}
        <aside style={{ 
          width: '280px', 
          backgroundColor: '#f8fafc', 
          borderRight: '1px solid #e2e8f0', 
          padding: '20px' 
        }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Search Vessels</h3>
          <input 
            type="text" 
            placeholder="Type a vessel name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e1',
              marginBottom: '15px' 
            }}
          />
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Active ships matching your search will remain on the map.
          </p>
        </aside>

        {/* Main Area for Milestone 2 Visualization [cite: 32, 47] */}
        <main style={{ flex: 1, background: '#f1f5f9' }}>
          <VesselMap search={searchTerm} />
        </main>
      </div>
    </div>
  );
}

export default App;