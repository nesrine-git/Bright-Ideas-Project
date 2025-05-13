import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CommentSection from './CommentSection';

const IdeaCard = ({ idea, userId, onLikeToggle, onDelete, onUpdate }) => {
  const [editingIdeaId, setEditingIdeaId] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [likeInFlight, setLikeInFlight] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const likes = Array.isArray(idea.likes) ? idea.likes : [];
  const isLiked = likes.includes(userId);

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
    } catch (err) {
      console.error('Idea update failed', err);
    }
  };

  return (
    <div className="card p-3 mb-3 shadow-sm position-relative">
      {/* Idea Owner Actions */}
      {idea.creator && idea.creator?._id === userId && (
        <Dropdown className="position-absolute top-0 end-0 m-2">
          <Dropdown.Toggle variant="transparent" size="sm">⚙️</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => {
              setEditingIdeaId(idea._id);
              setEditedContent({
                title: idea.title,
                content: idea.content,
                emotionalContext: idea.emotionalContext || ''
              });
            }}>✏️ Edit</Dropdown.Item>
            <Dropdown.Item onClick={() => onDelete(idea._id)} className="text-danger">🗑 Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}

      {/* Content */}
      {editingIdeaId === idea._id ? (
        <div>
          <input
            className="form-control mb-2"
            value={editedContent.title || ''}
            onChange={e => setEditedContent({ ...editedContent, title: e.target.value })}
          />
          <textarea
            className="form-control mb-2"
            value={editedContent.content || ''}
            onChange={e => setEditedContent({ ...editedContent, content: e.target.value })}
          />
          <input
            className="form-control mb-2"
            value={editedContent.emotionalContext || ''}
            onChange={e => setEditedContent({ ...editedContent, emotionalContext: e.target.value })}
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
            <small className="text-secondary">
              🧑‍💻 by <Link to={`/users/${idea.creator._id}`} className="text-decoration-underline">
                {idea.creator.alias || idea.creator.name}
              </Link>
            </small>
          )}
        </>
      )}

      {/* Actions */}
      <div className="mt-2 d-flex align-items-center gap-2">
        <button
          aria-label={isLiked ? 'Unlike' : 'Like'}
          className="btn border-0"
          onClick={() => handleToggleIdeaLike(idea._id)}
          disabled={likeInFlight}
        >
          {isLiked ? '👎' : '👍'}
        </button>
        <Link to={`/ideas/${idea._id}/likes`} className="badge bg-secondary">
          {likes.length} Likes
        </Link>
        <button
          className="btn border-0"
          onClick={() => setShowComments(prev => !prev)}
          aria-label="Toggle comments"
        >
          💬
        </button>
      </div>

      {showComments && (
        <>
          <hr />
          <CommentSection ideaId={idea._id} userId={userId} />
        </>
      )}
    </div>
  );
};

export default IdeaCard;
