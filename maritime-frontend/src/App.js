import React, { useState } from 'react'; // Added useState
import './App.css';
import VesselMap from './components/VesselMap';

function App() {
  // Logic for Milestone 2: State to store the search text
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="App">
      <header style={{ backgroundColor: '#1a2a3a', padding: '15px', color: 'white', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>Maritime Tracking System</h1>
      </header>
      
      <div style={{ display: 'flex', height: '90vh' }}>
        {/* Sidebar for Search and Filtering */}
        <aside style={{ width: '280px', backgroundColor: '#f4f4f4', borderRight: '1px solid #ddd', overflowY: 'auto', padding: '20px' }}>
          <h3>Search Vessels</h3>
          <input 
            type="text" 
            placeholder="Type a vessel name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Updates state as you type
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginBottom: '20px', 
              borderRadius: '5px', 
              border: '1px solid #ccc' 
            }}
          />
          <p style={{ fontSize: '0.85em', color: '#666' }}>
            Active ships matching your search will remain on the map.
          </p>
        </aside>

        {/* Main Map Area */}
        <main style={{ flex: 1 }}>
          {/* We pass the searchTerm to the map component */}
          <VesselMap search={searchTerm} />
        </main>
      </div>
    </div>
  );
}

export default App;