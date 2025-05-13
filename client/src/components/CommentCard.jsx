import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CommentCard = ({
  comment,
  userId,
  isEditing,
  editedContent,
  onEditStart,
  onEditCancel,
  onEditSave,
  onEditChange,
  onDelete,
  onLike,
}) => {
  const hasLiked = Array.isArray(comment.likes) && comment.likes.includes(userId);

  return (
    <li className="list-group-item position-relative">
      {isEditing ? (
        <>
          <textarea
            className="form-control mb-2"
            value={editedContent}
            onChange={onEditChange}
          />
          <button className="btn btn-success btn-sm me-2" onClick={onEditSave}>💾 Save</button>
          <button className="btn btn-secondary btn-sm" onClick={onEditCancel}>❌ Cancel</button>
        </>
      ) : (
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <strong>
              <Link to={`/users/${comment.creator._id}`} className="text-decoration-underline">
                {comment.creator.alias || comment.creator.name}
              </Link>
            </strong>: {comment.content}
          </div>
          <div className="d-flex gap-2 align-items-center">
            {comment.creator._id === userId && (
              <Dropdown align="end">
                <Dropdown.Toggle variant="transparent" size="sm">⚙️</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={onEditStart}>✏️ Edit</Dropdown.Item>
                  <Dropdown.Item onClick={onDelete} className="text-danger">🗑 Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            <button className="btn btn-sm" onClick={onLike}>
              {hasLiked ? '💔' : '❤️'} {comment.likes?.length || 0}
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default CommentCard;
