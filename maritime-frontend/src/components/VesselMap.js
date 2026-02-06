import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Helper: Haversine Formula ---
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

// --- Leaflet Icon Fixes ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

// --- MAIN COMPONENT ---
const VesselMap = ({ search = "", activeModule = "vessels" }) => {
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [voyages, setVoyages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [playbackIndex, setPlaybackIndex] = useState(0);

  const [userRole, setUserRole] = useState(
    (localStorage.getItem('user_role') || 'operator').toLowerCase()
  );

  useEffect(() => {
    const savedRole = localStorage.getItem('user_role');
    if (savedRole) setUserRole(savedRole.toLowerCase());
    
    fetchData();
    const interval = setInterval(() => { fetchData(); }, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) { window.location.href = '/'; return; }

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
    } catch (err) { 
      console.error("Sync Error:", err); 
      if (err.response?.status === 401) handleLogout();
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const runSafetyAnalysis = (currVessels, currPorts) => {
    const alerts = [];
    currVessels.forEach(v => {
      currPorts.forEach(p => {
        const pCoords = p.location.split(',').map(Number);
        const dist = calculateDistance(v.last_position_lat, v.last_position_lon, pCoords[0], pCoords[1]);
        if (dist < 50) alerts.push(`⚠️ ${v.name} near ${p.name}`);
      });
    });
    setNotifications(alerts.slice(0, 5));
  };

  // --- Search & Filtering Logic ---
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

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>⚡ Secure Maritime Link Establishing...</div>;

  return (
    <div style={{ padding: '20px', background: '#f8fafc', height: '100%', boxSizing: 'border-box' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', height: '100%' }}>
        
        {/* --- LEFT COLUMN: THE MAP --- */}
        <div style={{ position: 'relative' }}>
          <MapContainer center={[20, 70]} zoom={3} style={{ height: '80vh', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* 1. MODULE: SAFETY EVENTS (Visible in "notifications" mode) */}
            {activeModule === 'notifications' && events.map(event => (
              <Circle 
                key={event.id} 
                center={event.location.split(',').map(Number)} 
                radius={200000} 
                pathOptions={{ color: event.event_type === 'Storm' ? 'orange' : 'red', fillOpacity: 0.3 }}
              >
                <Popup><strong>{event.event_type}</strong>: {event.details}</Popup>
              </Circle>
            ))}

            {/* 2. MODULE: VESSELS (Visible in "vessels" mode) */}
            {activeModule === 'vessels' && filteredVessels.map(v => {
              const isInRiskZone = events.some(event => {
                const eventCoords = event.location.split(',').map(Number);
                return calculateDistance(v.last_position_lat, v.last_position_lon, eventCoords[0], eventCoords[1]) < 200;
              });

              return (
                <React.Fragment key={v.id}>
                  <Marker position={[v.last_position_lat, v.last_position_lon]} icon={isInRiskZone ? redIcon : blueIcon}>
                    <Popup><strong>{v.name}</strong><br/>Type: {v.vessel_type}</Popup>
                  </Marker>
                  <Polyline positions={currentHistory.map(h => [h.latitude, h.longitude])} color="#3b82f6" weight={2} dashArray="5, 5" />
                </React.Fragment>
              );
            })}

            {/* 3. MODULE: PORTS (Visible in "ports" mode) */}
            {activeModule === 'ports' && ports.map(p => (
              <Marker key={p.id} position={p.location.split(',').map(Number)} icon={portIcon}>
                <Popup><strong>{p.name}</strong><br/>Status: Operational</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* --- RIGHT COLUMN: DYNAMIC SIDEBAR DATA --- */}
        <div style={sidebarContainerStyle}>
          
          {/* SHOW ALERTS IN NOTIFICATIONS MODE */}
          {activeModule === 'notifications' && (
            <>
              <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#ef4444' }}>⚠️ Safety Alerts</h3>
              {notifications.map((note, i) => (
                <div key={i} style={alertCardStyle}>{note}</div>
              ))}
            </>
          )}

          {/* SHOW VOYAGE LOG IN VESSELS MODE */}
          {activeModule === 'vessels' && (
            <>
              <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Voyage Audit Log</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {voyages.map(voy => (
                  <div key={voy.id} style={logEntryStyle}>
                    <strong>{voy.vessel_name}</strong><br/>
                    <small>{voy.port_from_name} ➔ {voy.port_to_name}</small>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* SHOW ANALYTICS IN PORTS MODE */}
          {activeModule === 'ports' && (
            <>
              <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Port Operations</h3>
              <div style={statsCardStyle}>
                <div style={{ fontSize: '0.7rem' }}>ACTIVE HUBS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{ports.length} Locations</div>
              </div>
            </>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '0.9rem' }}>Fleet Stats</h3>
            <div style={statsCardStyle}>
              <div style={{ fontSize: '0.7rem', color: '#0369a1' }}>TOTAL DISTANCE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0369a1' }}>{totalDist.toFixed(2)} km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const sidebarContainerStyle = { background: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '80vh' };
const alertCardStyle = { padding: '10px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold' };
const logEntryStyle = { padding: '10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem' };
const statsCardStyle = { padding: '15px', background: '#f0f9ff', borderRadius: '10px' };

export default VesselMap;