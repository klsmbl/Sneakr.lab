import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { signIn as apiSignIn, signUp as apiSignUp } from '../services/api';
import './SignIn.css';

export function SignIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { signIn } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let data;
      if (isSignUp) {
        data = await apiSignUp(email, password, role);
      } else {
        data = await apiSignIn(email, password);
      }
      signIn(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {isSignUp && (
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <button type="submit" className="submit-btn">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <p onClick={() => setIsSignUp(!isSignUp)} className="toggle-link">
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}
