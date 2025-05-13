import React, { useEffect, useState } from 'react';
import commentService from '../services/commentService';
import CommentCard from './CommentCard';
import { toast } from 'react-toastify';

const CommentSection = ({ ideaId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await commentService.getAllByIdea(ideaId);
        setComments(res);
      } catch (err) {
        console.error(err);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [ideaId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const comment = await commentService.create(ideaId, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      toast.error('Could not add comment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await commentService.delete(id);
      setComments(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleLike = async (id) => {
    try {
      const updated = await commentService.toggleLike(id);
      setComments(prev => prev.map(c => c._id === updated._id ? updated : c));
    } catch (err) {
      toast.error('Like failed');
    }
  };

  const handleUpdate = async (id) => {
    if (!editedContent.trim()) {
      toast.error('Content required');
      return;
    }
    try {
      const updated = await commentService.update(id, editedContent);
      setComments(prev => prev.map(c => c._id === id ? updated : c));
      setEditCommentId(null);
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="comments-section mt-3">
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

      {loading ? (
        <p>Loading comments...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <ul className="list-group list-group-flush">
          {comments.map(c => (
            <CommentCard
              key={c._id}
              comment={c}
              userId={userId}
              isEditing={editCommentId === c._id}
              editedContent={editedContent}
              onEditStart={() => {
                setEditCommentId(c._id);
                setEditedContent(c.content);
              }}
              onEditCancel={() => setEditCommentId(null)}
              onEditSave={() => handleUpdate(c._id)}
              onEditChange={e => setEditedContent(e.target.value)}
              onDelete={() => handleDelete(c._id)}
              onLike={() => handleLike(c._id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;
