import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext'; // Adjust path accordingly

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
  const { theme } = useTheme();
  const hasLiked = Array.isArray(comment.likes) && comment.likes.includes(userId);

  // Destructure colors from theme
  const {
    text,
    background,
    border,
    buttonBg,
    buttonHoverBg,
    supportBg,
    supportText,
    linkText,
  } = theme.colors;

  return (
    <li
      className="list-group-item rounded-lg shadow-md mb-4 p-4 relative w-full"
      style={{
        backgroundColor: theme.mode === 'dark' ? theme.colors.cardBg : background,
        color: text,
        border: `1px solid ${border}`,
      }}
    >
      {isEditing ? (
        <>
          <textarea
            className="form-control mb-2 p-2 rounded-lg focus:outline-none w-full"
            value={editedContent}
            onChange={onEditChange}
            style={{
              border: `1px solid ${border}`,
              backgroundColor: theme.mode === 'dark' ? '#374151' : '#fff',
              color: text,
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-success btn-sm py-1 px-4 rounded-md"
              onClick={onEditSave}
              style={{
                backgroundColor: '#22c55e', // green-500 (save button)
                color: '#fff',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#16a34a')} // green-600
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#22c55e')}
            >
              💾 Save
            </button>
            <button
              className="btn btn-secondary btn-sm py-1 px-4 rounded-md"
              onClick={onEditCancel}
              style={{
                backgroundColor: theme.mode === 'dark' ? '#6b7280' : '#6b7280', // gray-500
                color: '#fff',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#4b5563')} // gray-600
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#6b7280')}
            >
              ❌ Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2 relative w-full">
          {/* Settings Dropdown (Top-right corner) */}
          {comment.creator._id === userId && (
            <div className="absolute top-0 right-0">
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="transparent"
                  size="sm"
                  style={{ color: theme.mode === 'dark' ? '#9ca3af' : '#6b7280', border: 'none' }} // gray-400/500 text
                  className="hover:text-gray-700"
                >
                  ⚙️
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={onEditStart}
                    style={{ color: linkText }}
                  >
                    ✏️ Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={onDelete}
                    style={{ color: supportText }}
                  >
                    🗑 Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}

          {/* User Info and Content */}
          <div
            className="flex flex-wrap items-center gap-2 break-words w-full"
            style={{ color: text }}
          >
            {comment.creator.image ? (
              <img
                src={`http://localhost:3000/uploads/${comment.creator.image}`}
                alt="profile"
                className="rounded-full w-9 h-9"
              />
            ) : (
              <div
                className="rounded-full flex justify-center items-center w-9 h-9"
                style={{ backgroundColor: '#9ca3af', color: '#fff' }} // gray-400 bg and white text
              >
                {comment.creator.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <strong>
                <Link
                  to={`/users/${comment.creator._id}`}
                  style={{ color: linkText }}
                  className="hover:underline break-words"
                >
                  {comment.creator.alias || comment.creator.name} :
                </Link>
              </strong>
              <span
                className="ml-1 break-words"
                style={{ color: text }}
              >
                {comment.content}
              </span>
            </div>
          </div>

          {/* Footer */}
          <span
            className="ml-10 text-xs"
            style={{ color: theme.mode === 'dark' ? '#9ca3af' : '#6b7280' }} // gray-400 or gray-500
          >
            {new Date(comment.createdAt).toLocaleString()}
          </span>
          <div
            className="flex flex-wrap gap-2 items-center text-sm w-full"
            style={{ color: theme.mode === 'dark' ? '#9ca3af' : '#6b7280' }}
          >
            <button
              onClick={onLike}
              className="px-2 text-sm rounded-lg transition-colors duration-200"
              style={{
                color: hasLiked ? '#dc2626' : theme.mode === 'dark' ? '#9ca3af' : '#6b7280', // red-600 or gray
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = hasLiked ? '#b91c1c' : theme.mode === 'dark' ? '#d1d5db' : '#4b5563'; // red-700 or gray-600
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = hasLiked ? '#dc2626' : theme.mode === 'dark' ? '#9ca3af' : '#6b7280';
              }}
            >
              {hasLiked ? '👎' : '👍'} {comment.likes?.length || 0}
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default CommentCard;
