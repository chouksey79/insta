import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getUser, removeToken, removeUser } from '../utils/auth';

const NavBar = ({ currentUser, navigate, showBack = false }) => {
  const handleLogout = () => {
    removeToken();
    removeUser();
    navigate('/login');
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

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setProfileUser(response.data.user);
      // Use the isFollowing flag from API response
      setIsFollowing(response.data.user.isFollowing || false);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get(`/posts/user/${userId}`);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleFollow = async () => {
    try {
      const endpoint = isFollowing ? `/users/unfollow/${userId}` : `/users/follow/${userId}`;
      await api.post(endpoint);
      setIsFollowing(!isFollowing);
      fetchProfile();
    } catch (err) {
      console.error('Error following/unfollowing:', err);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      const endpoint = isLiked ? `/posts/${postId}/unlike` : `/posts/${postId}/like`;
      await api.post(endpoint);
      fetchPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId) => {
    const text = commentTexts[postId];
    if (!text || !text.trim()) return;

    try {
      await api.post(`/posts/${postId}/comment`, { text });
      setCommentTexts({ ...commentTexts, [postId]: '' });
      fetchPosts();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleLogout = () => {
    removeToken();
    removeUser();
    navigate('/login');
  };

  const isLiked = (post) => {
    return post.likes?.some(like => 
      (typeof like === 'object' ? like._id : like) === currentUser?.id
    );
  };

  const isOwnProfile = currentUser?.id === userId;

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!profileUser) {
    return <div className="container">User not found</div>;
  }

  return (
    <div>
      <NavBar currentUser={currentUser} navigate={navigate} showBack={true} />
      <div className="container" style={{ paddingTop: '80px' }}>
        {isOwnProfile && (
          <div style={{ marginBottom: '20px', textAlign: 'right' }}>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}

      <div className="card">
        <div className="card-body">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#dbdbdb',
              marginRight: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              flexShrink: 0
            }}>
              👤
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{profileUser.username}</h2>
              <div style={{ 
                display: 'flex', 
                gap: '20px', 
                marginTop: '10px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <strong>{posts.length}</strong> posts
                </div>
                <div>
                  <strong>{profileUser.followersCount || 0}</strong> followers
                </div>
                <div>
                  <strong>{profileUser.followingCount || 0}</strong> following
                </div>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              className={isFollowing ? 'btn btn-secondary' : 'btn btn-primary'}
              onClick={handleFollow}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}

          {isOwnProfile && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/create-post')}
            >
              Create Post
            </button>
          )}
        </div>
      </div>

      <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>
        Posts ({posts.length})
      </h3>

      {posts.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <p>No posts yet</p>
          </div>
        </div>
      ) : (
        posts.map(post => {
          const liked = isLiked(post);
          return (
            <div key={post._id} className="card">
              <div className="card-header">
                <strong>{post.user?.username}</strong>
              </div>
              
              <div style={{ width: '100%' }}>
                <img 
                  src={post.imageUrl} 
                  alt={post.caption}
                  style={{ width: '100%', display: 'block' }}
                />
              </div>

              <div className="card-body">
                <div style={{ marginBottom: '10px' }}>
                  <button
                    onClick={() => handleLike(post._id, liked)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '24px',
                      marginRight: '10px'
                    }}
                  >
                    {liked ? '❤️' : '🤍'}
                  </button>
                  <strong>{post.likes?.length || 0} likes</strong>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <strong>{post.user?.username}</strong> {post.caption}
                </div>

                {post.comments && post.comments.length > 0 && (
                  <div style={{ marginBottom: '10px', color: '#8e8e8e' }}>
                    View all {post.comments.length} comments
                    <div style={{ marginTop: '5px' }}>
                      {post.comments.slice(-2).map((comment, idx) => (
                        <div key={idx} style={{ marginBottom: '5px' }}>
                          <strong>{comment.username}</strong> {comment.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  marginTop: '10px',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="input"
                    style={{ 
                      marginBottom: '0', 
                      flex: '1',
                      minWidth: '150px'
                    }}
                    value={commentTexts[post._id] || ''}
                    onChange={(e) => setCommentTexts({
                      ...commentTexts,
                      [post._id]: e.target.value
                    })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleComment(post._id);
                      }
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleComment(post._id)}
                    style={{ flexShrink: 0 }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};

export default Profile;
