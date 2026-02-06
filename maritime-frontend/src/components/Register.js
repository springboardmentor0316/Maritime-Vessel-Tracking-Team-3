import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setView }) => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', role: 'operator' 
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");

    try {
      await axios.post('http://127.0.0.1:8000/api/register/', { 
        username: formData.username, 
        email: formData.email,
        password: formData.password,
        role: formData.role 
      });
      alert(`Account created successfully!`);
      setView('login'); 
    } catch (error) {
      alert("Registration failed. Try a different username.");
    }
  };

  return (
    <div style={regContainerStyle}>
      <form onSubmit={handleRegister} style={regFormStyle}>
        <h2 style={{ textAlign: 'center', color: '#10b981', marginBottom: '25px' }}>⚓ Join Fleet Command</h2>
        
        <input 
          type="text" 
          placeholder="Username" 
          onChange={e => setFormData({...formData, username: e.target.value})} 
          style={regInputStyle} required 
        />
        
        <input 
          type="email" 
          placeholder="Email Address" 
          onChange={e => setFormData({...formData, email: e.target.value})} 
          style={regInputStyle} required 
        />
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'bold' }}>AUTHORIZATION LEVEL</label>
          <select 
            value={formData.role}
            onChange={e => setFormData({...formData, role: e.target.value})}
            style={regInputStyle} required
          >
            <option value="operator">Operator (Fleet Monitor)</option>
            <option value="analyst">Analyst (Data Insights)</option>
            <option value="admin">Admin (System Control)</option>
          </select>
        </div>
        
        <input 
          type="password" 
          placeholder="Password" 
          onChange={e => setFormData({...formData, password: e.target.value})} 
          style={regInputStyle} required 
        />

        <input 
          type="password" 
          placeholder="Confirm Password" 
          onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
          style={regInputStyle} required 
        />

        <button type="submit" style={regButtonStyle}>Initialize Security Profile</button>
        
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          Already registered? 
          <span onClick={() => setView('login')} style={loginLinkStyle}>Sign In</span>
        </p>
      </form>
    </div>
  );
};

// --- Updated Styles ---
const regContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#064e3b' };
const regFormStyle = { background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', width: '400px' };
const regInputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' };
const regButtonStyle = { width: '100%', padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const loginLinkStyle = { color: '#1a73e8', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' };

export default Register;