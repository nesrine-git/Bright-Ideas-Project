import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import commentService from '../services/commentService';

const IdeaCard = ({ idea, userId, onLikeToggle, onDelete }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);

  // Ensure likes is an array
  const likes = Array.isArray(idea.likes) ? idea.likes : [];
  const isLiked = likes.includes(userId);

  // Fetch comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await commentService.getAllByIdea(idea._id);
        setComments(res);
      } catch (err) {
        console.error('Failed to load comments', err);
        setError('Could not load comments');
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [idea._id]);

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const comment = await commentService.create(idea._id, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Add comment failed', err);
      setError('Could not add comment');
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentService.delete(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Delete comment failed', err);
      setError('Could not delete comment');
    }
  };
  // Handle toggle like comment
  const handleLikeComment = async (id) => {
    try {
      const updated = await commentService.toggleLike(id);
      setComments(prev =>
        prev.map(x => x._id === updated._id ? updated : x)
      );
    } catch (err) {
      console.error('Toggle like failed', err);
    }
  }

  return (
    <div className="card p-3 mb-3 shadow-sm">
      <h5 className="fw-bold">{idea.title}</h5>
      <p>{idea.content}</p>

      {idea.emotionalContext && (
        <small className="text-muted">😊 {idea.emotionalContext}</small>
      )}
      <br />
      {(idea.creator?.alias || idea.creator?.name) && (
        <small className="text-secondary">🧑‍💻 by {idea.creator.alias || idea.creator?.name}</small>
      )}

      <div className="mt-2">
        <button
          type="button"
          aria-label={isLiked ? 'Unlike this idea' : 'Like this idea'}
          className="btn btn-warning me-2"
          onClick={() => onLikeToggle(idea._id)}
        >
          {isLiked ? '👎' : '👍'}
        </button>
        <Link to={`/ideas/${idea._id}/likes`} className="badge bg-secondary me-2">
          {likes.length} Likes
        </Link>
        {idea.creator._id === userId && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onDelete(idea._id)}
          >
            Delete
          </button>
        )}
      </div>

      {/* Comments Section */}
      <hr />
      <div className="comments-section">
        <form onSubmit={handleAddComment} className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
        </form>

        {loadingComments ? (
          <p>Loading comments...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <ul className="list-group list-group-flush">
            {comments.map(c => {
              const hasLiked = Array.isArray(c.likes) && c.likes.includes(userId);
              return (
              <li key={c._id} className="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <strong>{c.creator.alias || c.creator.name}:</strong> {c.content}
                </div>
                <div>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleLikeComment(c._id)}
                  >
                    {hasLiked ? '💔' : '❤️'} {Array.isArray(c.likes) ? c.likes.length : 0}
                  </button>
                {c.creator._id === userId && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteComment(c._id)}
                  >
                    Delete
                  </button>
                )}
                </div>
              </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default IdeaCard;
