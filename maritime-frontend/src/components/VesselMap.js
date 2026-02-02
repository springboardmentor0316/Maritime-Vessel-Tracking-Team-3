import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default vessel marker icons (Blue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom Green Icon for Ports to distinguish them from ships
const portIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const VesselMap = ({ search = "" }) => {
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);

  useEffect(() => {
    // Fetch Vessels
    axios.get('http://127.0.0.1:8000/api/vessels/')
      .then(res => setVessels(res.data))
      .catch(err => console.error('Error fetching vessels:', err));

    // Fetch Ports (Milestone 1 requirement)
    axios.get('http://127.0.0.1:8000/api/ports/')
      .then(res => setPorts(res.data))
      .catch(err => console.error('Error fetching ports:', err));
  }, []);

  // Filter vessels based on the search term (Milestone 2 requirement)
  const filteredVessels = vessels.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <MapContainer center={[20, 70]} zoom={3} style={{ height: '70vh', width: '100%', borderRadius: '15px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* DISPLAY FILTERED VESSELS (Ships) */}
        {filteredVessels.map(vessel => (
          <Marker 
            key={`v-${vessel.id}`} 
            position={[vessel.last_position_lat, vessel.last_position_lon]}
          >
            <Popup>
              <strong>Vessel: {vessel.name}</strong><br />
              Type: {vessel.vessel_type}<br />
              Flag: {vessel.flag}
            </Popup>
          </Marker>
        ))}

        {/* DISPLAY PORTS (Using Green Icon) */}
        {ports.map(port => {
          // Converts your DB "Location" string "18.94, 72.85" into [18.94, 72.85]
          const coords = port.location ? port.location.split(',').map(Number) : null;
          
          return coords ? (
            <Marker key={`p-${port.id}`} position={coords} icon={portIcon}>
              <Popup>
                <strong>Port: {port.name}</strong><br />
                Country: {port.country}
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>
    </div>
  );
};

export default VesselMap;