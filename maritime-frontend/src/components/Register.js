import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setView }) => {
  const [formData, setFormData] = useState({
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    role: 'operator' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation for demo robustness
    if (formData.password !== formData.confirmPassword) {
      return setError("Security passcodes do not match!");
    }

    setIsLoading(true);
    try {
      // Endpoint matches RegisterView in core/views.py
      await axios.post('http://127.0.0.1:8000/api/register/', { 
        username: formData.username, 
        email: formData.email,
        password: formData.password,
        role: formData.role 
      });
      
      alert(`Security Profile Initialized: Account created as ${formData.role.toUpperCase()}`);
      setView('login'); 
      
    } catch (error) {
      console.error("Enrollment error:", error);
      setError(error.response?.data?.error || "Registration failed. Username may be taken.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={regContainerStyle}>
      <form onSubmit={handleRegister} style={regFormStyle}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>⚓</h1>
          <h2 style={{ color: '#0f172a', margin: '10px 0 5px', letterSpacing: '1px' }}>FLEET ENROLLMENT</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Establish New Operational Identity</p>
        </div>

        {error && (
          <div style={errorBanner}>{error}</div>
        )}
        
        <label style={labelStyle}>Operational Identifier (Username)</label>
        <input 
          type="text" 
          placeholder="Assign username" 
          value={formData.username}
          onChange={e => setFormData({...formData, username: e.target.value})} 
          style={regInputStyle} 
          disabled={isLoading}
          required 
        />
        
        <label style={labelStyle}>Contact Channel (Email)</label>
        <input 
          type="email" 
          placeholder="official@maritime.com" 
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})} 
          style={regInputStyle} 
          disabled={isLoading}
          required 
        />
        
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Authorization Level</label>
          <select 
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value})}
            style={regInputStyle} 
            disabled={isLoading}
            required
          >
            <option value="operator">Operator (Fleet Monitor)</option>
            <option value="analyst">Analyst (Data Insights)</option>
            <option value="admin">Admin (Full System Control)</option>
          </select>
        </div>
        
        <label style={labelStyle}>Security Passcode</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={formData.password}
          onChange={e => setFormData({...formData, password: e.target.value})} 
          style={regInputStyle} 
          disabled={isLoading}
          required 
        />

        <label style={labelStyle}>Confirm Passcode</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={formData.confirmPassword}
          onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
          style={regInputStyle} 
          disabled={isLoading}
          required 
        />

        <button type="submit" style={isLoading ? disabledButtonStyle : regButtonStyle} disabled={isLoading}>
          {isLoading ? 'ENROLLING IDENTITY...' : 'INITIALIZE PROFILE'}
        </button>
        
        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.85rem', color: '#64748b' }}>
          Already have a profile? 
          <span onClick={() => setView('login')} style={loginLinkStyle}>Secure Log In</span>
        </p>
      </form>
    </div>
  );
};

// --- Updated Command Center Styles ---
const regContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a', padding: '40px 0' };
const regFormStyle = { background: '#fff', padding: '45px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', width: '420px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '0.7rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' };
const regInputStyle = { width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '12px', border: '1.5px solid #e2e8f0', boxSizing: 'border-box', outline: 'none', fontSize: '0.9rem' };
const regButtonStyle = { width: '100%', padding: '16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '1px', transition: '0.3s' };
const disabledButtonStyle = { ...regButtonStyle, background: '#94a3b8', cursor: 'not-allowed' };
const errorBanner = { padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '20px', fontWeight: 'bold', border: '1px solid #fecaca' };
const loginLinkStyle = { color: '#3b82f6', cursor: 'pointer', marginLeft: '8px', fontWeight: 'bold', textDecoration: 'underline' };

export default Register;