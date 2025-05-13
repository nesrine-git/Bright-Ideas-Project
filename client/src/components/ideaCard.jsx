import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import commentService from '../services/commentService';
import { toast } from 'react-toastify';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const IdeaCard = ({ idea, userId, onLikeToggle, onDelete, onUpdate }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editingIdeaId, setEditingIdeaId] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [likeInFlight, setLikeInFlight] = useState(false);

  const likes = Array.isArray(idea.likes) ? idea.likes : [];
  const isLiked = likes.includes(userId);

  useEffect(() => {
    if (!idea._id) return;
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
      setComments(prev => prev.map(c => c._id === updated._id ? updated : c));
    } catch (err) {
      console.error('Toggle like failed', err);
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      if (!editedContent.content?.trim()) {
        toast.error('Comment content cannot be empty');
        return;
      }
      const updated = await commentService.update(commentId, editedContent.content);
      setComments(prev => prev.map(c => c._id === commentId ? updated : c));
      setEditCommentId(null);
      toast.success('Comment updated');
    } catch (err) {
      console.error('Update failed', err);
      toast.error('Update failed');
    }
  };

  const handleToggleIdeaLike = async (id) => {
    setLikeInFlight(true);
    try {
      await onLikeToggle(id);
    } finally {
      setLikeInFlight(false);
    }
  };

  const handleUpdateIdea = async (id) => {
    try {
      const updatedIdea = await onUpdate(id, editedContent);
      setEditingIdeaId(null);
      setEditedContent({});
      toast.success("Idea updated!");
    } catch (err) {
      console.error('Idea update failed', err);
      toast.error('Idea update failed');
    }
  };

  return (
    <div className="card p-3 mb-3 shadow-sm position-relative">
      {idea.creator && idea.creator?._id === userId && (
        <Dropdown className="position-absolute top-0 end-0 m-1">
          <Dropdown.Toggle variant="transparent" size="sm">⚙️</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => {
              setEditingIdeaId(idea._id);
              setEditedContent({
                title: idea.title,
                content: idea.content,
                emotionalContext: idea.emotionalContext || ''
              });
            }}>
              ✏️ Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onDelete(idea._id)} className="text-danger">
              🗑 Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}

      {/* Idea Content */}
      {editingIdeaId === idea._id ? (
        <div className="mb-3">
          <input
            className="form-control mb-2"
            value={editedContent.title || ''}
            placeholder="Title"
            onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
          />
          <textarea
            className="form-control mb-2"
            value={editedContent.content || ''}
            placeholder="Content"
            onChange={(e) => setEditedContent({ ...editedContent, content: e.target.value })}
          />
          <input
            className="form-control mb-2"
            value={editedContent.emotionalContext || ''}
            placeholder="Emotional context"
            onChange={(e) => setEditedContent({ ...editedContent, emotionalContext: e.target.value })}
          />
          <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdateIdea(idea._id)}>💾 Save</button>
          <button className="btn btn-secondary btn-sm" onClick={() => { setEditingIdeaId(null); setEditedContent({}); }}>❌ Cancel</button>
        </div>
      ) : (
        <>
          <h5 className="fw-bold">{idea.title}</h5>
          <p>{idea.content}</p>
          {idea.emotionalContext && <small className="text-muted">😊 {idea.emotionalContext}</small>}<br />
          {(idea.creator?.alias || idea.creator?.name) && (
            <strong className="text-secondary me-1">
               By{' '}
              <Link to={`/users/${idea.creator._id}`}>
                {idea.creator.alias || idea.creator.name}
              </Link>
            </strong>
          )}
        </>
      )}

      {/* Like & Link */}
      <div className="mt-2">
        <button
          type="button"
          aria-label={isLiked ? 'Unlike this idea' : 'Like this idea'}
          className="btn border border-0"
          onClick={() => handleToggleIdeaLike(idea._id)}
          disabled={likeInFlight}
        >
          {isLiked ? '👎' : '👍'}
        </button>
        <Link
          to={`/ideas/${idea._id}/likes`}
          className={`badge text-secondary ${likes.length === 0 ? 'disabled' : ''}`}
          aria-disabled={likes.length === 0}
        >
          {likes.length} Likes
        </Link>
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
                <li key={c._id} className="list-group-item position-relative">
                  {editCommentId === c._id ? (
                    <>
                      <textarea
                        value={editedContent.content || ''}
                        onChange={e => setEditedContent({ content: e.target.value })}
                        className="form-control mb-2"
                      />
                      <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdateComment(c._id)}>💾 Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditCommentId(null)}>❌ Cancel</button>
                    </>
                  ) : (
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>
                          <Link to={`/users/${c.creator._id}`}>
                            {c.creator.alias || c.creator.name}
                          </Link>
                          :
                        </strong> {c.content}
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        {c.creator._id === userId && (
                          <Dropdown align="end">
                            <Dropdown.Toggle variant="transparent" size="sm">⚙️</Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => {
                                setEditCommentId(c._id);
                                setEditedContent({ content: c.content });
                              }}>
                                ✏️ Edit
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDeleteComment(c._id)} className="text-danger">
                                🗑 Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        <button className="btn btn-sm border border-0" onClick={() => handleLikeComment(c._id)}>
                          {hasLiked ? '👎' : '👍'} {c.likes?.length || 0}
                        </button>
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
