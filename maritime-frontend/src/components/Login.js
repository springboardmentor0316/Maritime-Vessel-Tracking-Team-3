import React, { useState } from 'react';
import axios from 'axios';



const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
    
    // Save token for authentication
    localStorage.setItem('access_token', response.data.access);
    
    // SAVE THE ROLE: Critical for VesselMap.js logic
    localStorage.setItem('user_role', response.data.role); 
    
    window.location.href = '/map';
  } catch (error) {
    alert("Invalid credentials");
  }
};

localStorage.setItem('user_role', res.data.role); // Ensure your backend returns this!

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <h2>🚢 Maritime Login</h2>
        <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} style={{ width: '100%', marginBottom: '15px', padding: '10px' }} required />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '15px', padding: '10px' }} required />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  );
};

export default Login;