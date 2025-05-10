import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ideaService from '../services/ideaService';

const LikeStatus = () => {
  const { id: ideaId } = useParams();
  const [likers, setLikers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikers = async () => {
      try {
        const res = await ideaService.getLikes(ideaId);
        setLikers(res);
      } catch (err) {
        console.error('Failed to load likers', err);
        setError('Could not load likers');
      } finally {
        setLoading(false);
      }
    };
    fetchLikers();
  }, [ideaId]);

  if (loading) return <div>Loading likers...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2>People who liked this idea</h2>
      <Link to="/home" className="btn btn-link mb-3">← Back to Home</Link>
      {likers.length === 0 ? (
        <p>No one has liked this idea yet.</p>
      ) : (
        <ul className="list-group">
          {likers.map(user => (
            <li key={user._id} className="list-group-item">
              {user.alias || user.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikeStatus;
