import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getUser } from '../utils/auth';

const NavBar = ({ currentUser, navigate }) => {
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
          <button
            onClick={() => navigate('/')}
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
            onClick={() => navigate('/create-post')}
            style={{ fontSize: '13px' }}
          >
            ➕ Create
          </button>
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

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState({});
  const navigate = useNavigate();
  const currentUser = getUser();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users);
      // Initialize following states
      const states = {};
      response.data.users.forEach(user => {
        states[user.id] = user.isFollowing;
      });
      setFollowingStates(states);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId, currentState) => {
    try {
      const endpoint = currentState ? `/users/unfollow/${userId}` : `/users/follow/${userId}`;
      await api.post(endpoint);
      setFollowingStates({
        ...followingStates,
        [userId]: !currentState
      });
      // Refresh users to update follower counts
      fetchUsers();
    } catch (err) {
      console.error('Error following/unfollowing:', err);
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) {
    return (
      <div>
        <NavBar currentUser={currentUser} navigate={navigate} />
        <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#8e8e8e' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar currentUser={currentUser} navigate={navigate} />
      <div className="container" style={{ paddingTop: '80px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
          Discover People
        </h2>

        {users.length === 0 ? (
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#8e8e8e' }}>No other users found</p>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-body" style={{ padding: '0' }}>
              {users.map(user => {
                const isFollowing = followingStates[user.id] || false;
                return (
                  <div
                    key={user.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderBottom: '1px solid #efefef',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/profile/${user.id}`)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#dbdbdb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0
                      }}>
                        👤
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '4px',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${user.id}`);
                          }}
                        >
                          {user.username}
                        </div>
                        <div style={{ fontSize: '12px', color: '#8e8e8e' }}>
                          {user.followersCount} followers • {user.followingCount} following
                        </div>
                      </div>
                    </div>
                    <button
                      className={isFollowing ? 'btn btn-secondary' : 'btn btn-primary'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollow(user.id, isFollowing);
                      }}
                      style={{ flexShrink: 0, fontSize: '13px', padding: '6px 16px' }}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
