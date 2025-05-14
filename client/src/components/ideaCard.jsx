import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import CommentSection from './CommentSection';

const IdeaCard = ({ idea, userId, onSupportToggle, onInspireToggle, onDelete, onUpdate }) => {
  const [editingIdeaId, setEditingIdeaId] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const supports = Array.isArray(idea.supports) ? idea.supports : [];
  const inspiring = Array.isArray(idea.inspiring) ? idea.inspiring : [];

  const isSupported = supports.includes(userId);
  const isInspiring = inspiring.includes(userId);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="relative bg-white rounded-2xl shadow-md p-4 mb-6 border border-gray-200">
      {/* Owner Options */}
      {idea.creator && idea.creator?._id === userId && (
        <div className="absolute top-2 right-2" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ⚙️
          </button>
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                key="dropdown"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50"
              >
                <button
                  onClick={() => {
                    setEditingIdeaId(idea._id);
                    setEditedContent({
                      title: idea.title,
                      content: idea.content,
                      emotionalContext: idea.emotionalContext || '',
                    });
                    setShowDropdown(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setShowDropdown(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100"
                >
                  🗑 Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Idea Content */}
      {editingIdeaId === idea._id ? (
        <div className="space-y-2">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={editedContent.title || ''}
            onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
            placeholder="Title"
          />
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={editedContent.content || ''}
            onChange={(e) => setEditedContent({ ...editedContent, content: e.target.value })}
            placeholder="Content"
          />
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={editedContent.emotionalContext || ''}
            onChange={(e) => setEditedContent({ ...editedContent, emotionalContext: e.target.value })}
            placeholder="Emotional Context"
          />
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              onClick={() => handleUpdateIdea(idea._id)}
            >
              💾 Save
            </button>
            <button
              className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
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
        <>
          <h3 className="text-lg font-semibold text-gray-800">{idea.title}</h3>
          <p className="text-gray-700">{idea.content}</p>
          {idea.emotionalContext && (
            <p className="text-sm text-gray-500">😊 {idea.emotionalContext}</p>
          )}
          {(idea.creator?.alias || idea.creator?.name) && (
            <p className="text-xs text-gray-400">
              🧑‍💻 by{' '}
              <Link to={`/users/${idea.creator._id}`} className="underline text-blue-600">
                {idea.creator.alias || idea.creator.name}
              </Link>
            </p>
          )}
        </>
      )}

      {/* Buttons */}
      <div className="mt-4 flex items-center flex-wrap gap-3 text-sm">
        <button
          className={`px-3 py-1 rounded-md border ${
            isSupported ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          } hover:shadow`}
          onClick={() => handleToggleSupport(idea._id)}
        >
          {isSupported ? '❌ Support' : '✅ Support'}
        </button>

        <button
          className={`px-3 py-1 rounded-md border ${
            isInspiring ? 'bg-yellow-100 text-yellow-600' : 'bg-purple-100 text-purple-600'
          } hover:shadow`}
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
          onClick={() => setShowComments((prev) => !prev)}
        >
          💬 {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <>
          <hr className="my-4 border-gray-300" />
          <CommentSection ideaId={idea._id} userId={userId} />
        </>
      )}
    </div>
  );
};

export default IdeaCard;
