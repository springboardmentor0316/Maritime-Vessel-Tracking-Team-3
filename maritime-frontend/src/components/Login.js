import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use a relative path if possible, or ensure it points to the Django port
      const response = await axios.post('http://127.0.0.1:8000/api/token/', { 
        username, 
        password 
      });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user_role', response.data.role); 
      
      setToken(response.data.access);
      // Removed window.location.href to allow App.js to handle the transition smoothly
      
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>🚢</h1>
            <h2 style={{ color: '#0f172a', margin: '10px 0 5px' }}>Maritime Command</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Secure Fleet Access</p>
        </div>
        
        <label style={labelStyle}>Username</label>
        <input 
          type="text" 
          placeholder="Enter username" 
          onChange={e => setUsername(e.target.value)} 
          style={inputStyle} 
          required 
        />

        <label style={labelStyle}>Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          onChange={e => setPassword(e.target.value)} 
          style={inputStyle} 
          required 
        />

        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <span 
            onClick={() => alert("Contact system administrator for reset.")} 
            style={{ color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Forgot Password?
          </span>
        </div>

        <button type="submit" style={loginButtonStyle}>Sign In to Dashboard</button>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#64748b' }}>
          Need access? 
          <span 
            onClick={() => setView('register')} 
            style={{ color: '#3b82f6', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}
          >
            Request Account
          </span>
        </p>
      </form>
    </div>
  );
};

// --- Updated Styles ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' };
const formStyle = { background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', width: '400px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#334155', fontWeight: '600', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px', boxSizing: 'border-box' };
const loginButtonStyle = { width: '100%', padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };

export default Login;