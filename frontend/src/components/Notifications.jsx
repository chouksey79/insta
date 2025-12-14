import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getUser } from '../utils/auth';
import SharedNavBar from './SharedNavBar';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = getUser();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notif =>
        notif._id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getNotificationText = (notification) => {
    const username = notification.fromUser?.username || 'Someone';
    switch (notification.type) {
      case 'follow':
        return `${username} started following you`;
      case 'like':
        return `${username} liked your post`;
      case 'comment':
        return `${username} commented on your post`;
      default:
        return 'New notification';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }

    if (notification.type === 'follow') {
      navigate(`/profile/${notification.fromUser?._id || notification.fromUser}`);
    } else if (notification.post) {
      navigate(`/post/${notification.post._id || notification.post}`);
    }
  };

  if (loading) {
    return (
      <div>
        <SharedNavBar showBack={true} />
        <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#8e8e8e' }}>Loading...</div>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <SharedNavBar showBack={true} />
      <div className="container" style={{ paddingTop: '80px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{
                marginLeft: '10px',
                fontSize: '14px',
                color: '#0095f6',
                fontWeight: '600'
              }}>
                ({unreadCount} new)
              </span>
            )}
          </h2>
          {unreadCount > 0 && (
            <button
              className="btn btn-secondary"
              onClick={markAllAsRead}
              style={{ fontSize: '13px' }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔔</div>
              <p style={{ color: '#8e8e8e' }}>No notifications yet</p>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body" style={{ padding: '0' }}>
              {notifications.map(notification => (
                <div
                  key={notification._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: '1px solid #efefef',
                    cursor: 'pointer',
                    backgroundColor: notification.read ? 'white' : '#fafafa',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  onMouseEnter={(e) => {
                    if (!notification.read) {
                      e.currentTarget.style.backgroundColor = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = notification.read ? 'white' : '#fafafa';
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#dbdbdb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                    marginRight: '12px'
                  }}>
                    {notification.type === 'follow' ? '👤' : 
                     notification.type === 'like' ? '❤️' : '💬'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                      {getNotificationText(notification)}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#8e8e8e',
                      marginTop: '4px'
                    }}>
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!notification.read && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#0095f6',
                      flexShrink: 0,
                      marginLeft: '12px'
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
