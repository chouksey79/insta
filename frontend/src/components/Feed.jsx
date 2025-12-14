import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getUser } from '../utils/auth';
import SharedNavBar from './SharedNavBar';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState({});
  const navigate = useNavigate();
  const currentUser = getUser();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await api.get('/posts/feed');
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      const endpoint = isLiked ? `/posts/${postId}/unlike` : `/posts/${postId}/like`;
      await api.post(endpoint);
      fetchFeed();
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
      fetchFeed();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const isLiked = (post) => {
    return post.likes?.some(like => 
      (typeof like === 'object' ? like._id : like) === currentUser?.id
    );
  };

  if (loading) {
    return (
      <div>
        <SharedNavBar />
        <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>
          <div style={{ fontSize: '18px', color: '#8e8e8e' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div>
        <SharedNavBar />
        <div className="container" style={{ paddingTop: '80px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📷</div>
            <h2 style={{ fontSize: '24px', marginBottom: '12px', fontWeight: '600' }}>
              Your Feed
            </h2>
            <p style={{ color: '#8e8e8e', marginBottom: '30px', fontSize: '16px' }}>
              Follow users to see their posts here
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/discover')}
              >
                🔍 Discover People
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/create-post')}
              >
                Create Your First Post
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(`/profile/${currentUser?.id}`)}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SharedNavBar />
      <div className="container" style={{ paddingTop: '80px' }}>

        {posts.map(post => {
          const liked = isLiked(post);
          return (
            <div key={post._id} className="card">
              <div className="card-header">
                <strong 
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${post.user?._id || post.user}`);
                  }}
                >
                  {post.user?.username}
                </strong>
              </div>
              
              <div 
                style={{ width: '100%', cursor: 'pointer' }}
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <img 
                  src={post.imageUrl} 
                  alt={post.caption}
                  style={{ width: '100%', display: 'block' }}
                />
              </div>

              <div className="card-body">
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => handleLike(post._id, liked)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '28px',
                      padding: '0',
                      lineHeight: '1'
                    }}
                  >
                    {liked ? '❤️' : '🤍'}
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    {post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}
                  </span>
                </div>

                <div style={{ marginBottom: '12px', fontSize: '14px', lineHeight: '1.5' }}>
                  <strong 
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                    onClick={() => navigate(`/profile/${post.user?._id || post.user}`)}
                  >
                    {post.user?.username}
                  </strong>
                  <span>{post.caption}</span>
                </div>

                {post.comments && post.comments.length > 0 && (
                  <div style={{ marginBottom: '12px', color: '#8e8e8e', fontSize: '14px' }}>
                    {post.comments.length > 2 && (
                      <div style={{ marginBottom: '8px', cursor: 'pointer' }}>
                        View all {post.comments.length} comments
                      </div>
                    )}
                    <div>
                      {post.comments.slice(-2).map((comment, idx) => (
                        <div key={idx} style={{ marginBottom: '6px', lineHeight: '1.5' }}>
                          <strong style={{ color: '#262626', marginRight: '8px' }}>{comment.username}</strong>
                          <span>{comment.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  marginTop: '8px',
                  gap: '8px',
                  alignItems: 'center',
                  borderTop: '1px solid #efefef',
                  paddingTop: '12px'
                }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="input"
                    style={{ 
                      marginBottom: '0', 
                      flex: '1',
                      minWidth: '150px',
                      border: 'none',
                      padding: '4px 0',
                      fontSize: '14px'
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
                    onClick={() => handleComment(post._id)}
                    style={{ 
                      background: 'none',
                      border: 'none',
                      color: '#0095f6',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      opacity: (commentTexts[post._id]?.trim() ? 1 : 0.5)
                    }}
                    disabled={!commentTexts[post._id]?.trim()}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Feed;
