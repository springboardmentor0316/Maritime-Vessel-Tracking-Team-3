import React from 'react';
import './App.css';
import VesselMap from './components/VesselMap';

function App() {
  return (
    <div className="App">
      <header style={{ backgroundColor: '#282c34', padding: '20px', color: 'white' }}>
        <h1>Maritime Vessel Tracker</h1>
        <p>Real-time Port Analytics & Safety Visualization [cite: 1]</p>
      </header>
      <main>
        <VesselMap />
      </main>
    </div>
  );
}

export default App;