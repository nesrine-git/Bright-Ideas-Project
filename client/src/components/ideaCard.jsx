import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import CommentSection from './CommentSection';
import 'bootstrap/dist/css/bootstrap.min.css';

const IdeaCard = ({ idea, userId, onSupportToggle, onInspireToggle, onDelete, onUpdate }) => {
  const [editingIdeaId, setEditingIdeaId] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [showComments, setShowComments] = useState(false);

  const supports = Array.isArray(idea.supports) ? idea.supports : [];
  const inspiring = Array.isArray(idea.inspirations) ? idea.inspirations : [];

  const isSupported = supports.includes(userId);
  const isInspiring = inspiring.includes(userId);
  console.log(inspiring, isInspiring);
  

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
  <div className="relative bg-white rounded-2xl shadow-md mb-6 border border-gray-200">
    {/* Card Header */}
    <div className="bg-gray-100 p-2 rounded-t-2xl flex items-center justify-between">
      {/* User Info */}
      <div className="flex items-center gap-2 text-gray-400">
        {idea.creator.image ? (
          <img
            src={`http://localhost:3000/uploads/${idea.creator.image}`}
            alt="profile"
            className="rounded-full w-9 h-9"
          />
        ) : (
          <div className="rounded-full bg-gray-400 text-white flex justify-center items-center w-9 h-9">
            {idea.creator.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <Link to={`/users/${idea.creator._id}`} className="underline text-blue-600">
          {idea.creator.alias || idea.creator.name}
        </Link>
      </div>

      {/* Edit & Delete Buttons */}
      {idea.creator && idea.creator?._id === userId && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingIdeaId(idea._id);
              setEditedContent({
                title: idea.title,
                content: idea.content,
                emotionalContext: idea.emotionalContext || ''
              });
            }}
            className="text-blue-500 hover:text-blue-700 text-sm"
            title="Edit"
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm"
            title="Delete"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={editedContent.title || ''}
          onChange={e => setEditedContent({ ...editedContent, title: e.target.value })}
          placeholder="Title"
        />
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={editedContent.content || ''}
          onChange={e => setEditedContent({ ...editedContent, content: e.target.value })}
          placeholder="Content"
        />
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={editedContent.emotionalContext || ''}
          onChange={e => setEditedContent({ ...editedContent, emotionalContext: e.target.value })}
          placeholder="Emotional Context"
        />
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600" onClick={() => handleUpdateIdea(idea._id)}>
            💾 Save
          </button>
          <button className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400" onClick={() => {
            setEditingIdeaId(null);
            setEditedContent({});
          }}>
            ❌ Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="p-3">
        <h3 className="text-lg font-semibold text-gray-800">{idea.title}</h3>
        <p className="text-gray-700">{idea.content}</p>
        {idea.emotionalContext && (
          <p className="text-sm text-gray-500">😊 {idea.emotionalContext}</p>
        )}
      </div>
    )}

    {/* Buttons */}
    <div className="px-3 pb-3 mt-2 flex items-center flex-wrap gap-3 text-sm">
      <button
        className={`px-3 py-1 rounded-md border ${isSupported ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} hover:shadow`}
        onClick={() => handleToggleSupport(idea._id)}
      >
        {isSupported ? '❌ Support' : '✅ Support'}
      </button>

      <button
        className={`px-3 py-1 rounded-md border ${isInspiring ? 'bg-yellow-100 text-yellow-600' : 'bg-purple-100 text-purple-600'} hover:shadow`}
        onClick={() => handleToggleInspiring(idea._id)}
      >
        {isInspiring ? '❌ Inspire' : '✨ Inspire'}
      </button>

      <Link
        to={`/ideas/${idea._id}/likes`}
        className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-semibold hover:bg-yellow-500"
      >
        {supports.length + inspiring.length} Reactions
      </Link>

      <button
        className="ml-auto px-2 py-1 text-blue-500 hover:text-blue-700"
        onClick={() => setShowComments(prev => !prev)}
      >
        💬 {showComments ? 'Hide Comments' : 'Show Comments'}
      </button>
    </div>

    {/* Comments */}
    {showComments && (
      <>
        <hr className="mx-3 my-4 border-gray-300" />
        <div className="px-3 pb-3">
          <CommentSection ideaId={idea._id} userId={userId} />
        </div>
      </>
    )}
  </div>
);
};

export default IdeaCard;
