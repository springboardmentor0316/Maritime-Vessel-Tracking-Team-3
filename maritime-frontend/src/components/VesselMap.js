import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Haversine Formula for Distance Calculation
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Icon Fixes
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/vessels/').then(res => setVessels(res.data));
    axios.get('http://127.0.0.1:8000/api/ports/').then(res => setPorts(res.data));
    axios.get('http://127.0.0.1:8000/api/history/').then(res => setHistory(res.data));
  }, []);

  const filteredVessels = vessels.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- MILESTONE 3 ANALYTICS LOGIC ---
  const currentHistory = history
    .filter(h => h.vessel_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const totalDistance = currentHistory.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return 0;
    const prev = arr[idx - 1];
    return acc + calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
  }, 0);

  const calculateSpeed = () => {
    if (currentHistory.length < 2) return 0;
    const first = new Date(currentHistory[0].timestamp);
    const last = new Date(currentHistory[currentHistory.length - 1].timestamp);
    const hours = Math.abs(last - first) / 36e5; // Convert ms to hours
    return hours > 0 ? (totalDistance / hours) : 0;
  };

  const avgSpeed = calculateSpeed();

  return (
    <div style={{ padding: '20px' }}>
      <MapContainer center={[20, 70]} zoom={3} style={{ height: '60vh', width: '100%', borderRadius: '15px', marginBottom: '20px', border: '1px solid #ddd' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
        
        {filteredVessels.map(vessel => {
          const vesselHistory = history
            .filter(h => h.vessel === vessel.id)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

          const path = vesselHistory.map(h => [h.latitude, h.longitude]);
          const lastSeen = vesselHistory.length > 0 ? new Date(vesselHistory[vesselHistory.length - 1].timestamp).toLocaleString() : "N/A";

          return (
            <React.Fragment key={`group-${vessel.id}`}>
              <Marker position={[vessel.last_position_lat, vessel.last_position_lon]}>
                <Popup>
                  <strong>{vessel.name}</strong><br />
                  <small>Last Tracked: {lastSeen}</small>
                </Popup>
              </Marker>
              {path.length > 1 && <Polyline positions={path} color="#1a73e8" weight={4} opacity={0.7} dashArray="10, 10" />}
            </React.Fragment>
          );
        })}

        {ports.map(port => {
          const coords = port.location ? port.location.split(',').map(Number) : null;
          return coords ? <Marker key={`p-${port.id}`} position={coords} icon={portIcon}><Popup>Port: {port.name}</Popup></Marker> : null;
        })}
      </MapContainer>

      {/* COMPLETED MILESTONE 3 DASHBOARD */}
      <div style={{ background: '#ffffff', padding: '25px', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Tracking Analytics Log</h2>
          
          {/* UPDATED JOURNEY STATS SECTION */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#666' }}>JOURNEY STATS</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1a73e8', marginRight: '15px' }}>
              {totalDistance.toFixed(2)} km
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
              {avgSpeed.toFixed(2)} km/h Avg Speed
            </span>
          </div>
        </div>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#fcfcfc', borderBottom: '2px solid #eee' }}>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '15px' }}>Vessel</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Recorded At</th>
              </tr>
            </thead>
            <tbody>
              {[...currentHistory].reverse().map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{log.vessel_name}</td>
                  <td style={{ color: '#666' }}>{log.latitude.toFixed(4)}°</td>
                  <td style={{ color: '#666' }}>{log.longitude.toFixed(4)}°</td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VesselMap;