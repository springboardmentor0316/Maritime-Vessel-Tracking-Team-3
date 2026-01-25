import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// This fixes the issue where marker icons don't appear correctly in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const VesselMap = () => {
  const [vessels, setVessels] = useState([]);

  useEffect(() => {
    // 1. We use axios to "call" your Django API
    axios.get('http://127.0.0.1:8000/api/vessels/')
      .then(response => {
        // 2. We save the ship data (like Titanic 2) into our state
        setVessels(response.data);
      })
      .catch(error => {
        console.error('Error fetching vessels:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '70vh', width: '100%', borderRadius: '15px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* 3. We loop through the list of ships and place a marker for each one */}
        {vessels.map(vessel => (
          <Marker 
            key={vessel.id} 
            position={[vessel.last_position_lat, vessel.last_position_lon]}
          >
            <Popup>
              <strong>{vessel.name}</strong><br />
              Type: {vessel.vessel_type}<br />
              Flag: {vessel.flag}<br />
              IMO: {vessel.imo_number}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default VesselMap;