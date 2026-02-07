import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Endpoint matches the MyTokenObtainPairView in urls.py
      const response = await axios.post('http://127.0.0.1:8000/api/token/', { 
        username, 
        password 
      });
      
      // Store security credentials and extended identity
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Captures fields from CustomTokenObtainPairSerializer
      localStorage.setItem('user_role', response.data.role || 'operator'); 
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('user_email', response.data.email);
      
      // Triggers the state change in App.js to load the Map
      setToken(response.data.access);
      
    } catch (error) {
      console.error("Login Access Error:", error);
      setError(error.response?.data?.detail || "Invalid credentials. Fleet access denied.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div style={logoWrapper}>⚓</div>
            <h2 style={{ color: '#0f172a', margin: '15px 0 5px', letterSpacing: '1px' }}>MARITIME COMMAND</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Fleet Surveillance & Risk Terminal</p>
        </div>

        {error && (
          <div style={errorBanner}>{error}</div>
        )}
        
        <label style={labelStyle}>Operational Identity</label>
        <input 
          type="text" 
          placeholder="Enter username" 
          value={username}
          onChange={e => setUsername(e.target.value)} 
          style={inputStyle} 
          disabled={isLoading}
          required 
        />

        <label style={labelStyle}>Security Passcode</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
          style={inputStyle} 
          disabled={isLoading}
          required 
        />

        <div style={{ textAlign: 'right', marginBottom: '25px' }}>
          <span 
            onClick={() => alert("Credentials recovery request sent to Admin.")} 
            style={forgotPassStyle}
          >
            Recover Credentials?
          </span>
        </div>

        <button type="submit" style={isLoading ? disabledButtonStyle : loginButtonStyle} disabled={isLoading}>
          {isLoading ? 'AUTHENTICATING...' : 'INITIALIZE DASHBOARD'}
        </button>

        <p style={footerTextStyle}>
          Unauthorized access is strictly prohibited. 
          <span 
            onClick={() => setView('register')} 
            style={requestAccessStyle}
          >
            Request Fleet Access
          </span>
        </p>
      </form>
    </div>
  );
};

// --- Command Center UI Styles ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' };
const formStyle = { background: '#fff', padding: '45px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', width: '420px' };
const logoWrapper = { fontSize: '2.5rem', background: '#f8fafc', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '2px solid #e2e8f0' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #e2e8f0', marginBottom: '20px', boxSizing: 'border-box', outline: 'none', transition: '0.2s' };
const loginButtonStyle = { width: '100%', padding: '16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '1px', transition: '0.3s' };
const disabledButtonStyle = { ...loginButtonStyle, background: '#94a3b8', cursor: 'not-allowed' };
const errorBanner = { padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '20px', fontWeight: 'bold', border: '1px solid #fecaca' };
const forgotPassStyle = { color: '#3b82f6', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' };
const footerTextStyle = { textAlign: 'center', marginTop: '25px', fontSize: '0.85rem', color: '#94a3b8' };
const requestAccessStyle = { color: '#3b82f6', cursor: 'pointer', marginLeft: '8px', fontWeight: 'bold', textDecoration: 'underline' };

export default Login;