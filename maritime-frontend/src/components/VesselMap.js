import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// This section fixes a common bug where marker icons don't appear in React projects
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const VesselMap = () => {
  // We'll start centered on the ocean [cite: 16]
  const position = [20.0, 0.0]; 

  return (
    <div style={{ padding: '20px' }}>
      <MapContainer 
        center={position} 
        zoom={2} 
        style={{ height: '70vh', width: '100%', borderRadius: '10px', border: '2px solid #333' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Later, we will map through our Django Vessel data to put markers here [cite: 32] */}
        <Marker position={[18.92, 72.83]}>
          <Popup>
            Mumbai Port <br /> (Example Vessel Location)
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default VesselMap;