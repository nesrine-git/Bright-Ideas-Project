import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

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
    <li className="list-group-item bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4 p-4 relative">
      {isEditing ? (
        <>
          <textarea
            className="form-control mb-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none"
            value={editedContent}
            onChange={onEditChange}
          />
          <button
            className="btn btn-success btn-sm me-2 py-1 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={onEditSave}
          >
            💾 Save
          </button>
          <button
            className="btn btn-secondary btn-sm py-1 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={onEditCancel}
          >
            ❌ Cancel
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-2 relative">
          {/* Settings Dropdown (Top-right corner) */}
          {comment.creator._id === userId && (
            <div className="absolute top-0 right-0">
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="transparent"
                  size="sm"
                  className="text-gray-500 border-0 hover:text-gray-700"
                >
                  ⚙️
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={onEditStart} className="text-blue-600">
                    ✏️ Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onDelete} className="text-red-600">
                    🗑 Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center gap-2">
            {comment.creator.image ? (
              <img
                src={`http://localhost:3000/uploads/${comment.creator.image}`}
                alt="profile"
                className="rounded-full w-9 h-9"
              />
            ) : (
              <div className="rounded-full bg-gray-400 text-white flex justify-center items-center w-9 h-9">
                {comment.creator.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <strong>
                <Link
                  to={`/users/${comment.creator._id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {comment.creator.alias || comment.creator.name} :
                </Link>
              </strong>
            </div>
            {/* Comment Content */}
            <div className="ml-1 text-dark-500 dark:text-dark-90">
              {comment.content}
            </div>

          </div>

          
          {/* Footer with Date and Like */}
          <div className="ml-10 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
            <button
              onClick={onLike}
              className={`px-2 py-1 text-sm rounded-lg transition-colors duration-200 ${
                hasLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-500 hover:text-gray-600'
              }`}
            >
              {hasLiked ? '💔' : '❤️'} {comment.likes?.length || 0}
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default CommentCard;
