import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Helper: Haversine Formula (Requirements: Distance Calculation) ---
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

// --- Leaflet Icon Fixes (Presentation Requirement: Stable Visuals) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const portIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const piracyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// --- MAIN COMPONENT ---
const VesselMap = ({ search = "", activeModule = "vessels", showWeather = false }) => {
  const [vessels, setVessels] = useState([]);
  const [ports, setPorts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [voyages, setVoyages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const [userRole] = useState((localStorage.getItem('user_role') || 'operator').toLowerCase());

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => { fetchData(); }, 15000); // Faster refresh for demo
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const authConfig = { headers: { Authorization: `Bearer ${token}` } };
      
      // Robust API Fetching: Ensures map loads even if one endpoint fails
      const results = await Promise.allSettled([
        axios.get('http://127.0.0.1:8000/api/vessels/', authConfig),
        axios.get('http://127.0.0.1:8000/api/ports/', authConfig),
        axios.get('http://127.0.0.1:8000/api/history/', authConfig),
        axios.get('http://127.0.0.1:8000/api/events/', authConfig),
        axios.get('http://127.0.0.1:8000/api/voyages/', authConfig)
      ]);

      if (results[0].status === 'fulfilled') setVessels(results[0].value.data);
      if (results[1].status === 'fulfilled') setPorts(results[1].value.data);
      if (results[2].status === 'fulfilled') setHistory(results[2].value.data);
      if (results[3].status === 'fulfilled') setEvents(results[3].value.data);
      if (results[4].status === 'fulfilled') setVoyages(results[4].value.data);

      if (results[0].status === 'fulfilled' && results[1].status === 'fulfilled') {
          runSafetyAnalysis(results[0].value.data, results[1].value.data);
      }
    } catch (err) { 
      console.error("Satellite Sync Error:", err); 
    } finally { setLoading(false); }
  };

  const runSafetyAnalysis = (currVessels, currPorts) => {
    const alerts = [];
    currVessels.forEach(v => {
      currPorts.forEach(p => {
        const pCoords = p.location.split(',').map(Number);
        const dist = calculateDistance(v.last_position_lat, v.last_position_lon, pCoords[0], pCoords[1]);
        if (dist < 100) alerts.push(`⚠️ ${v.name} within 100km of ${p.name}`); // Safety requirement
      });
    });
    setNotifications(alerts.slice(0, 5));
  };

  // SEARCH LOGIC: Filter by Name OR MMSI
  const filteredVessels = vessels.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    (v.mmsi && v.mmsi.toString().includes(search))
  );

  if (loading) return <div style={loadingStyle}>Connecting to Global AIS Network...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', height: '100%' }}>
      <div style={mapWrapperStyle}>
        <MapContainer center={[15, 75]} zoom={4} style={{ height: '82vh', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* Historical Trail (Rendered during search) */}
          {search && <Polyline positions={history.map(h => [h.latitude, h.longitude])} color="#3b82f6" weight={2} dashArray="5, 5" />}

          {/* VESSELS LAYER */}
          {(activeModule === 'vessels' || activeModule === 'analytics') && filteredVessels.map(v => (
            <Marker key={v.id} position={[v.last_position_lat, v.last_position_lon]} icon={blueIcon}>
              <Popup>
                <div style={{ minWidth: '150px' }}>
                  <strong style={{ color: '#0f172a' }}>{v.name}</strong><br/>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>MMSI: {v.mmsi || 'N/A'}</span><br/>
                  <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
                  Type: {v.vessel_type}<br/>
                  Status: <span style={{ color: v.status === 'Active' ? '#10b981' : '#f59e0b' }}>{v.status}</span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* PORTS LAYER (Requirement: Port Congestion Visuals) */}
          {(activeModule === 'ports' || activeModule === 'analytics') && ports.map(p => (
            <Marker key={p.id} position={p.location.split(',').map(Number)} icon={portIcon}>
              <Popup><strong>{p.name}</strong><br/>Status: High Traffic</Popup>
            </Marker>
          ))}

          {/* SAFETY/PIRACY LAYER (Requirement: Risk Visuals) */}
          {(activeModule === 'notifications' || activeModule === 'piracy') && events.map(event => (
            <React.Fragment key={event.id}>
              <Circle 
                center={event.location.split(',').map(Number)} 
                radius={200000} 
                pathOptions={{ color: event.event_type === 'Storm' ? 'orange' : 'red', fillOpacity: 0.2 }}
              />
              <Marker position={event.location.split(',').map(Number)} icon={piracyIcon}>
                 <Popup><strong>{event.event_type} Alert:</strong> {event.details}</Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      <div style={sidebarContainerStyle}>
        {activeModule === 'analytics' && (
          <div>
            <h3 style={modHeader}>📊 Fleet Analytics</h3>
            <div style={analyticsBox}>
              <div style={label}>SURVEILLANCE STATUS</div>
              <div style={statValue}>{vessels.length} Ships Live</div>
            </div>
            <div style={analyticsBox}>
               <div style={label}>VESSEL DISTRIBUTION</div>
               <div style={{fontSize: '0.8rem', marginTop: '10px'}}>
                  {Array.from(new Set(vessels.map(v => v.vessel_type))).map(type => (
                    <div key={type} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                      <span>{type}</span>
                      <span style={{fontWeight: 'bold'}}>{vessels.filter(v => v.vessel_type === type).length}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeModule === 'vessels' && (
          <div>
            <h3 style={modHeader}>🚢 Voyage Audit</h3>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {voyages.map(voy => (
                <div key={voy.id} style={logEntryStyle}>
                  <strong>{voy.vessel_name}</strong>
                  <div style={{fontSize: '0.75rem', color: '#64748b'}}>{voy.port_from_name} ➔ {voy.port_to_name}</div>
                  <div style={statusTag(voy.status)}>{voy.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeModule === 'notifications' && (
          <div>
            <h3 style={{...modHeader, color: '#ef4444'}}>🚨 Risk Intelligence</h3>
            {notifications.map((note, i) => <div key={i} style={alertCardStyle}>{note}</div>)}
          </div>
        )}

        <div style={footerStats}>
          <div style={label}>IDENTITY</div>
          <div style={{fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase'}}>{userRole}</div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const loadingStyle = { textAlign: 'center', padding: '100px', color: '#64748b', fontSize: '1rem', fontWeight: 'bold' };
const mapWrapperStyle = { position: 'relative', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0' };
const sidebarContainerStyle = { background: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', height: '82vh' };
const modHeader = { fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px', color: '#1e293b' };
const analyticsBox = { padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '15px' };
const label = { fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.5px' };
const statValue = { fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' };
const alertCardStyle = { padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', marginBottom: '10px', fontSize: '0.8rem', fontWeight: 'bold' };
const logEntryStyle = { padding: '12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem' };
const footerStats = { marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '15px' };
const statusTag = (status) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold', marginTop: '5px', background: '#dcfce7', color: '#166534' });

export default VesselMap;