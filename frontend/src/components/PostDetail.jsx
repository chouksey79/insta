import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getUser } from '../utils/auth';

const NavBar = ({ currentUser, navigate, showBack = false }) => {
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

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${postId}`);
      setPost(response.data);
    } catch (err) {
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const isLiked = post.likes?.some(like => 
      (typeof like === 'object' ? like._id : like) === currentUser?.id
    );

    try {
      const endpoint = isLiked ? `/posts/${postId}/unlike` : `/posts/${postId}/like`;
      await api.post(endpoint);
      fetchPost();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async () => {
    if (!commentText || !commentText.trim()) return;

    try {
      await api.post(`/posts/${postId}/comment`, { text: commentText });
      setCommentText('');
      fetchPost();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const isLiked = () => {
    return post?.likes?.some(like => 
      (typeof like === 'object' ? like._id : like) === currentUser?.id
    );
  };

  if (loading) {
    return (
      <div>
        <NavBar currentUser={currentUser} navigate={navigate} showBack={true} />
        <div className="container" style={{ textAlign: 'center', paddingTop: '80px' }}>
          <div style={{ fontSize: '18px', color: '#8e8e8e' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div>
        <NavBar currentUser={currentUser} navigate={navigate} showBack={true} />
        <div className="container" style={{ paddingTop: '80px' }}>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
              <p>Post not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const liked = isLiked();

  return (
    <div>
      <NavBar currentUser={currentUser} navigate={navigate} showBack={true} />
      <div className="container" style={{ paddingTop: '80px' }}>
        <div className="card">
          <div className="card-header">
            <strong 
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/profile/${post.user?._id || post.user}`)}
            >
              {post.user?.username}
            </strong>
          </div>
          
          <div style={{ width: '100%' }}>
            <img 
              src={post.imageUrl} 
              alt={post.caption}
              style={{ width: '100%', display: 'block' }}
            />
          </div>

          <div className="card-body">
            <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleLike}
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
              <div style={{ marginBottom: '12px', fontSize: '14px' }}>
                <div style={{ marginBottom: '8px', color: '#8e8e8e', fontWeight: '600' }}>
                  {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {post.comments.map((comment, idx) => (
                    <div key={idx} style={{ marginBottom: '12px', lineHeight: '1.5' }}>
                      <strong style={{ color: '#262626', marginRight: '8px' }}>
                        {comment.username}
                      </strong>
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
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleComment();
                  }
                }}
              />
              <button
                onClick={handleComment}
                style={{ 
                  background: 'none',
                  border: 'none',
                  color: '#0095f6',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '4px 8px',
                  opacity: (commentText?.trim() ? 1 : 0.5)
                }}
                disabled={!commentText?.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
