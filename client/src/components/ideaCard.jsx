import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import commentService from '../services/commentService'; 
import { toast } from 'react-toastify'; // optional

const IdeaCard = ({ idea, userId, onLikeToggle, onDelete }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [likeInFlight, setLikeInFlight] = useState(false);

  const likes = Array.isArray(idea.likes) ? idea.likes : [];
  const isLiked = likes.includes(userId);

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

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const comment = await commentService.create(idea._id, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast.success('Comment added');
    } catch (err) {
      console.error('Add comment failed', err);
      setError('Could not add comment');
      toast.error('Add comment failed');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentService.delete(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      console.error('Delete comment failed', err);
      setError('Could not delete comment');
      toast.error('Delete failed');
    }
  };

  const handleLikeComment = async (id) => {
    try {
      const updated = await commentService.toggleLike(id);
      setComments(prev =>
        prev.map(x => x._id === updated._id ? updated : x)
      );
    } catch (err) {
      console.error('Toggle like failed', err);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const updated = await commentService.update(commentId, editedContent);
      setComments(prev =>
        prev.map(c => (c._id === commentId ? updated : c))
      );
      setEditingId(null);
      toast.success('Comment updated');
    } catch (err) {
      console.error('Update failed', err);
      toast.error('Update failed');
    }
  };

  const handleToggleLike = async (id) => {
    setLikeInFlight(true);
    try {
      await onLikeToggle(id);
    } finally {
      setLikeInFlight(false);
    }
  };

  return (
    <div className="card p-3 mb-3 shadow-sm">
      <h5 className="fw-bold">{idea.title}</h5>
      <p>{idea.content}</p>

      {idea.emotionalContext && (
        <small className="text-muted">😊 {idea.emotionalContext}</small>
      )}
      <br />
      {(idea.creator?.alias || idea.creator?.name) && (
        <small className="text-secondary">
          🧑‍💻 by {idea.creator.alias || idea.creator?.name}
        </small>
      )}

      <div className="mt-2">
        <button
          type="button"
          aria-label={isLiked ? 'Unlike this idea' : 'Like this idea'}
          className="btn btn-warning me-2"
          onClick={() => handleToggleLike(idea._id)}
          disabled={likeInFlight}
        >
          {isLiked ? '👎' : '👍'}
        </button>
        <Link
          to={`/ideas/${idea._id}/likes`}
          className={`badge bg-secondary me-2 ${likes.length === 0 ? 'disabled' : ''}`}
          aria-disabled={likes.length === 0}
        >
          {likes.length} Likes
        </Link>

        {idea.creator._id === userId && (
          <>
            <Link
              to={`/ideas/${idea._id}/edit`}
              className="btn btn-outline-info me-2"
            >
              ✏️ Edit
            </Link>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onDelete(idea._id)}
            >
              Delete
            </button>
          </>
        )}
      </div>

      <hr />

      {/* Comments Section */}
      <div className="comments-section">
        <form onSubmit={handleAddComment} className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add a comment..."
            value={newComment}
            maxLength={200}
            onChange={e => setNewComment(e.target.value)}
          />
          <small className="text-muted">{newComment.length}/200 characters</small>
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
                <li key={c._id} className="list-group-item">
                  {editingId === c._id ? (
                    <>
                      <textarea
                        value={editedContent}
                        onChange={e => setEditedContent(e.target.value)}
                        className="form-control mb-2"
                      />
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleUpdateComment(c._id)}
                      >
                        💾 Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingId(null)}
                      >
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{c.creator.alias || c.creator.name}:</strong> {c.content}
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleLikeComment(c._id)}
                        >
                          {hasLiked ? '💔' : '❤️'} {c.likes?.length || 0}
                        </button>
                        {c.creator._id === userId && (
                          <>
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => {
                                setEditingId(c._id);
                                setEditedContent(c.content);
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteComment(c._id)}
                            >
                              🗑 Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
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
