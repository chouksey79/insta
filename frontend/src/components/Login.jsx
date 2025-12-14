import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { setToken, setUser } from '../utils/auth';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const data = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await api.post(endpoint, data);
      
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container-wrapper">
        {/* Left Side - Phone Mockup with Instagram Images */}
        <div className="login-image-section">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="instagram-screenshots">
                <div className="screenshot slide-1"></div>
                <div className="screenshot slide-2"></div>
                <div className="screenshot slide-3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Signup Form */}
        <div className="login-form-section">
          <div className="login-form-container">
            <div className="card login-card">
              <div className="login-form">
                <h1 className="instagram-logo">
                  Instagram
                </h1>
                
                <p className="login-subtitle">
                  {isLogin ? 'Sign in to see photos and videos from your friends.' : 'Sign up to see photos and videos from your friends.'}
                </p>
                
                <form onSubmit={handleSubmit} className="auth-form">
                  {!isLogin && (
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      className="input auth-input"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  )}
                  
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input auth-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input auth-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  {error && <div className="error auth-error">{error}</div>}

                  <button 
                    type="submit" 
                    className="btn btn-primary auth-button"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
                  </button>
                </form>

                <div className="divider">
                  <span>OR</span>
                </div>

                <div className="social-login">
                  <button className="social-button">
                    <svg className="social-icon" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#385185" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Log in with Facebook</span>
                  </button>
                </div>

                <div className="forgot-password">
                  <a href="#" className="forgot-link">Forgot password?</a>
                </div>
              </div>
            </div>

            <div className="card signup-card">
              {isLogin ? (
                <div className="signup-prompt">
                  Don't have an account?{' '}
                  <span className="link signup-link" onClick={() => setIsLogin(false)}>
                    Sign up
                  </span>
                </div>
              ) : (
                <div className="signup-prompt">
                  Have an account?{' '}
                  <span className="link signup-link" onClick={() => setIsLogin(true)}>
                    Log in
                  </span>
                </div>
              )}
            </div>

            <div className="app-download">
              <p>Get the app.</p>
              <div className="app-badges">
                <div className="app-badge">
                  <svg viewBox="0 0 24 24" width="120" height="40">
                    <path fill="#000" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </div>
                <div className="app-badge">
                  <svg viewBox="0 0 24 24" width="120" height="40">
                    <path fill="#000" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
