import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Haversine Formula for Distance Calculation (Milestone 3: Congestion Logic)
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

// Leaflet Icon Fixes
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons for Ports and Risk Status
const portIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const VesselMap = ({ search = "" }) => {
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [voyages, setVoyages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [playbackIndex, setPlaybackIndex] = useState(0);

  const userRole = localStorage.getItem('user_role') || 'operator';

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => { fetchData(); }, 30000); // 30s Real-time refresh
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const authConfig = { headers: { Authorization: `Bearer ${token}` } };
      const [vRes, pRes, hRes, eRes, voyRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/vessels/', authConfig),
        axios.get('http://127.0.0.1:8000/api/ports/', authConfig),
        axios.get('http://127.0.0.1:8000/api/history/', authConfig),
        axios.get('http://127.0.0.1:8000/api/events/', authConfig),
        axios.get('http://127.0.0.1:8000/api/voyages/', authConfig)
      ]);
      setVessels(vRes.data);
      setPorts(pRes.data);
      setHistory(hRes.data);
      setEvents(eRes.data);
      setVoyages(voyRes.data);
      setPlaybackIndex(hRes.data.length > 0 ? hRes.data.length - 1 : 0);
      runSafetyAnalysis(vRes.data, pRes.data);
    } catch (err) { console.error("Sync Error:", err); } 
    finally { setLoading(false); }
  };

  const runSafetyAnalysis = (currVessels, currPorts) => {
    const alerts = [];
    currVessels.forEach(v => {
      currPorts.forEach(p => {
        const pCoords = p.location.split(',').map(Number);
        const dist = calculateDistance(v.last_position_lat, v.last_position_lon, pCoords[0], pCoords[1]);
        if (dist < 50) alerts.push(`⚠️ ${v.name} entering congestion zone near ${p.name}`);
      });
    });
    setNotifications(alerts.slice(0, 5));
  };

  const normalizedSearch = search.replace(/\s+/g, '').toLowerCase();
  const filteredVessels = vessels.filter(v => v.name.replace(/\s+/g, '').toLowerCase().includes(normalizedSearch));
  const currentHistory = history
    .filter(h => h.vessel_name.replace(/\s+/g, '').toLowerCase().includes(normalizedSearch))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const totalDist = currentHistory.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return 0;
    const prev = arr[idx - 1];
    return acc + calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
  }, 0);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>⚡ Authenticating Secure Maritime Link...</div>;

  return (
    <div style={{ padding: '20px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ background: '#fff', borderRadius: '15px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>🚢 Fleet Control Center</h2>
          <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Role: <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: '#3b82f6' }}>{userRole}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => fetchData()} style={{ padding: '10px 20px', background: '#1e293b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Sync Data</button>
          {(userRole === 'admin' || userRole === 'analyst') && (
            <button style={{ padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Export Compliance Audit</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <MapContainer center={[20, 70]} zoom={3} style={{ height: '65vh', borderRadius: '15px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {events.map(event => (
              <Circle 
                key={event.id} 
                center={event.location.split(',').map(Number)} 
                radius={200000} 
                pathOptions={{ color: event.event_type === 'Storm' ? 'orange' : 'red', fillOpacity: 0.3 }}
              >
                <Popup><strong>{event.event_type}</strong>: {event.details}</Popup>
              </Circle>
            ))}

            {filteredVessels.map(v => {
              // DYNAMIC MARKER LOGIC: Check proximity to safety events
              const isInRiskZone = events.some(event => {
                const eventCoords = event.location.split(',').map(Number);
                return calculateDistance(v.last_position_lat, v.last_position_lon, eventCoords[0], eventCoords[1]) < 200;
              });

              return (
                <React.Fragment key={v.id}>
                  <Marker 
                    position={[v.last_position_lat, v.last_position_lon]} 
                    icon={isInRiskZone ? redIcon : blueIcon}
                  >
                    <Popup>
                      <strong>{v.name}</strong><br/>
                      Type: {v.vessel_type}<br/>
                      {isInRiskZone && <span style={{color: 'red', fontWeight: 'bold'}}>⚠️ RISK DETECTED</span>}
                    </Popup>
                  </Marker>
                  <Polyline positions={currentHistory.map(h => [h.latitude, h.longitude])} color="#3b82f6" weight={2} dashArray="5, 5" />
                </React.Fragment>
              );
            })}

            {ports.map(p => (
              <Marker key={p.id} position={p.location.split(',').map(Number)} icon={portIcon}>
                <Popup><strong>{p.name}</strong><br/>Status: Functional</Popup>
              </Marker>
            ))}
          </MapContainer>

          {currentHistory.length > 0 && (
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 1000, background: 'rgba(255,255,255,0.95)', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>VOYAGE AUDIT REPLAY: {new Date(currentHistory[playbackIndex]?.timestamp).toLocaleString()}</label>
              <input type="range" min="0" max={currentHistory.length - 1} value={playbackIndex} onChange={(e) => setPlaybackIndex(parseInt(e.target.value))} style={{ width: '100%', marginTop: '5px' }} />
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflowY: 'auto', maxHeight: '65vh' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#ef4444' }}>⚠️ Active Safety Alerts</h3>
          {notifications.length > 0 ? notifications.map((note, i) => (
            <div key={i} style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>{note}</div>
          )) : <p style={{ fontSize: '0.8rem', color: '#64748b' }}>No active risks detected.</p>}
          
          <hr style={{ margin: '20px 0', borderColor: '#f1f5f9' }} />

          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Voyage Audit Log</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px' }}>
            {voyages.length > 0 ? voyages.map(voy => (
              <div key={voy.id} style={{ padding: '10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 'bold' }}>{voy.vessel_name}</div>
                <div style={{ color: '#64748b' }}>{voy.port_from_name} ➔ {voy.port_to_name}</div>
                <div style={{ fontSize: '0.7rem', marginTop: '3px', color: '#3b82f6' }}>Status: {voy.status}</div>
              </div>
            )) : <p style={{ fontSize: '0.8rem', color: '#64748b' }}>No voyage history recorded.</p>}
          </div>

          <h3 style={{ marginTop: '20px', fontSize: '1rem' }}>Fleet Distance Stats</h3>
          <div style={{ padding: '15px', background: '#f0f9ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#0369a1' }}>TOTAL MONITORED JOURNEY</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0369a1' }}>{totalDist.toFixed(2)} km</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VesselMap;