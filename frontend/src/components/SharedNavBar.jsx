import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getUser } from '../utils/auth';

const SharedNavBar = ({ showBack = false }) => {
  const navigate = useNavigate();
  const currentUser = getUser();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderBottom: '1px solid #dbdbdb',
      padding: '12px 0',
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              ←
            </button>
          )}
          <div 
            style={{ 
              fontSize: '24px', 
              fontFamily: 'Brush Script MT, cursive',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => navigate('/')}
          >
            Instagram
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/discover')}
            style={{ fontSize: '13px' }}
          >
            🔍 Discover
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/create-post')}
            style={{ fontSize: '13px' }}
          >
            ➕ Create
          </button>
          <div
            style={{
              position: 'relative',
              cursor: 'pointer',
              padding: '4px'
            }}
            onClick={() => navigate('/notifications')}
          >
            <div style={{ fontSize: '24px' }}>🔔</div>
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                backgroundColor: '#ed4956',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '600',
                border: '2px solid white'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </div>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#dbdbdb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px'
            }}
            onClick={() => navigate(`/profile/${currentUser?.id}`)}
          >
            👤
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedNavBar;
