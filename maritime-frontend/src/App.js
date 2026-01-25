import React from 'react';
import './App.css';
import VesselMap from './components/VesselMap';

function App() {
  return (
    <div className="App">
      <header style={{ backgroundColor: '#1a2a3a', padding: '15px', color: 'white', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>Maritime Tracking System</h1>
      </header>
      
      <div style={{ display: 'flex', height: '90vh' }}>
        {/* Sidebar for Vessel List */}
        <aside style={{ width: '250px', backgroundColor: '#f4f4f4', borderRight: '1px solid #ddd', overflowY: 'auto', padding: '10px' }}>
          <h3>Vessel List</h3>
          <p style={{ fontSize: '0.9em', color: '#666' }}>Active ships in the database will appear on the map.</p>
          {/* Later we can fetch the names here too! */}
        </aside>

        {/* Main Map Area */}
        <main style={{ flex: 1 }}>
          <VesselMap />
        </main>
      </div>
    </div>
  );
}

export default App;