import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ideaService from '../services/ideaService';
import Navbar from './Navbar';

const LikeStatus = () => {
  const { id } = useParams(); // ideaId
  const [idea, setIdea] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await ideaService.getLikes(id);
        setIdea(res);
      } catch (err) {
        console.error(err);
        setError('Failed to load like status');
      }
    };
    fetchLikes();
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!idea) return <p>Loading...</p>;

  return (
    <>
    <Navbar/>
    <div className="container">
            
      {/* Render Idea Card */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="fw-bold">{idea.title}</h5>
        <p>{idea.content}</p>
        {idea.emotionalContext && (
          <small className="text-muted">😊 {idea.emotionalContext}</small>
        )}
        <br />
        {idea.creator?.alias && (
          <small className="text-secondary">🧑‍💻 by {idea.creator.alias}</small>
        )}
      </div>
      <h3 className="mb-4">👍 People who liked this idea</h3>
      {/* Likes Table */}
      { idea.likes.length > 0 && (
      
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Alias</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {idea.likes.map(user => (
            <tr key={user._id}>
              <td>
                <Link to={`/users/${user._id}`}>
                  {user.alias || 'No alias'}
                </Link>
              </td>
              <td>{user.name || 'No name'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
    </>
  );
};

export default LikeStatus;
