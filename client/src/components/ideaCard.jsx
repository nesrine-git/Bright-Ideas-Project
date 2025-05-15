import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommentSection from './CommentSection';
import { useTheme } from '../context/ThemeContext';
import usePrefersDarkMode from '../hook/usePrefersDarkMode';

const IdeaCard = ({ idea, userId, onSupportToggle, onInspireToggle, onDelete, onUpdate }) => {
  const { theme } = useTheme();
  const isDarkMode = usePrefersDarkMode();
  const colors = theme.colors;
  console.log(colors)

  const [editingIdeaId, setEditingIdeaId] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [showComments, setShowComments] = useState(false);


  const supports = Array.isArray(idea.supports) ? idea.supports : [];
  const inspiring = Array.isArray(idea.inspirations) ? idea.inspirations : [];

  const isSupported = supports.includes(userId);
  const isInspiring = inspiring.includes(userId);
  
  
  const handleToggleSupport = async (id) => {
    try {
      await onSupportToggle(id);
      toast.success(isSupported ? 'Support removed!' : 'Idea supported!');
    } catch (err) {
      toast.error('Support toggle failed!');
    }
  };

  const handleToggleInspiring = async (id) => {
    try {
      await onInspireToggle(id);
      toast.success(isInspiring ? 'Inspiration removed!' : 'You found this inspiring!');
    } catch (err) {
      toast.error('Inspiration toggle failed!');
    }
  };

  const handleUpdateIdea = async (id) => {
    try {
      await onUpdate(id, editedContent);
      setEditingIdeaId(null);
      setEditedContent({});
      toast.success('Idea updated successfully!');
    } catch (err) {
      toast.error('Failed to update idea.');
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(idea._id);
      toast.info('Idea deleted.');
    } catch (err) {
      toast.error('Failed to delete idea.');
    }
  };

  

return (
  <div
    className="relative rounded-2xl shadow-md mb-6"
    style={{
      backgroundColor: colors?.cardBg,
      border: `1px solid ${colors?.border}`
    }}
  >
    {/* Card Header */}
    <div
      className="p-2 rounded-t-2xl flex flex-wrap items-center justify-between gap-y-2 sm:flex-nowrap"
      style={{ backgroundColor: colors?.inspireBg }}
    >
      {/* User Info */}
      <div className="flex items-center gap-2 min-w-0" style={{ color: colors?.text }}>
        {idea.creator.image ? (
          <img
            src={`http://localhost:3000/uploads/${idea.creator.image}`}
            alt="profile"
            className="rounded-full w-9 h-9 flex-shrink-0"
          />
        ) : (
          <div
            className="rounded-full flex justify-center items-center w-9 h-9 flex-shrink-0"
            style={{ backgroundColor: colors?.border, color: colors?.cardBg }}
          >
            {idea.creator.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <Link
          to={`/users/${idea.creator._id}`}
          className="truncate underline"
          style={{ color: colors?.linkText }}
        >
          {idea.creator.alias || idea.creator.name}
        </Link>
      </div>

      {/* Edit & Delete Buttons */}
      {idea.creator && idea.creator._id === userId && (
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => {
              setEditingIdeaId(idea._id);
              setEditedContent({
                title: idea.title,
                content: idea.content,
                emotionalContext: idea.emotionalContext || ''
              });
            }}
            className="text-sm"
            style={{ color: colors?.linkText }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-sm"
            style={{ color: colors?.supportText }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>

    {/* Idea Content */}
    {editingIdeaId === idea._id ? (
      <div className="space-y-2 p-3">
        <input
          className="w-full px-3 py-2 border rounded-md"
          style={{
            backgroundColor: colors?.cardBg,
            borderColor: colors?.border,
            color: colors?.text
          }}
          value={editedContent.title || ''}
          onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
          placeholder="Title"
        />
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          style={{
            backgroundColor: colors?.cardBg,
            borderColor: colors?.border,
            color: colors?.text
          }}
          value={editedContent.content || ''}
          onChange={(e) => setEditedContent({ ...editedContent, content: e.target.value })}
          placeholder="Content"
        />
        <input
          className="w-full px-3 py-2 border rounded-md"
          style={{
            backgroundColor: colors?.cardBg,
            borderColor: colors?.border,
            color: colors?.text
          }}
          value={editedContent.emotionalContext || ''}
          onChange={(e) => setEditedContent({ ...editedContent, emotionalContext: e.target.value })}
          placeholder="Emotional Context"
        />
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1 text-sm rounded"
            style={{ backgroundColor: '#10B981', color: '#fff' }}
            onClick={() => handleUpdateIdea(idea._id)}
          >
            💾 Save
          </button>
          <button
            className="px-3 py-1 text-sm rounded"
            style={{ backgroundColor: colors?.border, color: colors?.text }}
            onClick={() => {
              setEditingIdeaId(null);
              setEditedContent({});
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="p-3">
        <h3 className="text-lg font-semibold" style={{ color: colors?.text }}>
          {idea.title}
        </h3>
        <p style={{ color: colors?.text }}>{idea.content}</p>
        {idea.emotionalContext && (
          <p className="text-sm" style={{ color: colors?.text }}>
            😊 {idea.emotionalContext}
          </p>
        )}
      </div>
    )}

    {/* Buttons */}
    <div className="px-3 pb-3 mt-2 flex flex-wrap gap-3 items-center text-sm">
      <button
        className="px-3 py-1 rounded-md border hover:shadow"
        style={{
          backgroundColor: isSupported ? colors?.supportBg : '#D1FAE5',
          color: isSupported ? colors?.supportText : '#059669',
          borderColor: colors?.border
        }}
        onClick={() => handleToggleSupport(idea._id)}
      >
        {isSupported ? '❌ Support' : '✅ Support'}
      </button>

      <button
        className="px-3 py-1 rounded-md border hover:shadow"
        style={{
          backgroundColor: isInspiring ? colors?.inspireBg : '#E9D5FF',
          color: isInspiring ? colors?.inspireText : '#7C3AED',
          borderColor: colors?.border
        }}
        onClick={() => handleToggleInspiring(idea._id)}
      >
        {isInspiring ? '❌ Inspire' : '✨ Inspire'}
      </button>

      <Link
        to={`/ideas/${idea._id}/likes`}
        className="px-2 py-1 rounded text-xs font-semibold hover:shadow"
        style={{
          backgroundColor: colors?.buttonBg,
          color: '#000'
        }}
      >
        {supports.length + inspiring.length} Reactions
      </Link>

      <button
        className="px-2 py-1 hover:underline"
        style={{ color: colors?.linkText }}
        onClick={() => setShowComments((prev) => !prev)}
      >
        💬 {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>
    </div>

    {/* Comments */}
    {showComments && (
      <>
        <hr className="mx-3 my-4" style={{ borderColor: colors?.border }} />
        <div className="px-3 pb-3">
          <CommentSection ideaId={idea._id} userId={userId} />
        </div>
      </>
    )}
  </div>
);

};

export default IdeaCard;
