import { useState } from 'react';
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

const CreatePost = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/posts', { imageUrl, caption });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const currentUser = getUser();

  return (
    <div>
      <NavBar currentUser={currentUser} navigate={navigate} />
      <div className="container" style={{ paddingTop: '80px' }}>
        <div className="card">
          <div className="card-header">
            <h2>Create New Post</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Image URL"
                className="input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />

              <textarea
                placeholder="Caption (optional)"
                className="input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows="4"
                style={{ resize: 'vertical' }}
              />

              {error && <div className="error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
