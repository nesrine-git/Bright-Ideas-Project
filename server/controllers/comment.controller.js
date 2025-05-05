import Comment from '../models/comment.model.js';
import response from '../utils/response.js';

const commentController = {
  // ✅ Create a new comment on an idea
  async create(req, res) {
    try {
      const { content } = req.body;
      const ideaId = req.params.ideaId;

      // Create comment with optional content
      const comment = await Comment.create({
        content,
        idea: ideaId,
        creator: req.userId
      });

      response(res, 201, true, '💬 Comment added successfully', comment);
    } catch (err) {
      response(res, 400, false, '❌ Failed to add comment', err);
    }
  },

  // ✅ Get all comments for a specific idea
  async getAllByIdea(req, res) {
    try {
      const ideaId = req.params.ideaId;

      // Fetch all comments for this idea and populate creator object
      const comments = await Comment.find({ idea: ideaId })
        .populate('creator')
        .sort({ createdAt: -1 });

      response(res, 200, true, '📄 Comments fetched', comments);
    } catch (err) {
      response(res, 400, false, '❌ Failed to fetch comments', err);
    }
  },

  // ✅ Update a comment by its creator only
  async update(req, res) {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return response(res, 404, false, '❌ Comment not found');
      }

      // Ensure the logged-in user is the comment creator
      if (comment.creator.toString() !== req.userId) {
        return response(res, 403, false, '⛔ Unauthorized to update this comment');
      }

      // Update the content (if provided)
      comment.content = req.body.content || comment.content;
      await comment.save();

      response(res, 200, true, '✏️ Comment updated', comment);
    } catch (err) {
      response(res, 400, false, '❌ Update failed', err);
    }
  },

  // ✅ Toggle like/unlike on a comment
  async toggleLike(req, res) {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return response(res, 404, false, '❌ Comment not found');
      }

      const userId = req.userId;
      const hasLiked = comment.likes.includes(userId);

      // Toggle like
      if (hasLiked) {
        comment.likes.pull(userId);
      } else {
        comment.likes.push(userId);
      }

      await comment.save();
      response(res, 200, true, hasLiked ? '👎 Unliked' : '👍 Liked', comment);
    } catch (err) {
      response(res, 400, false, '❌ Failed to toggle like', err);
    }
  },
      // ✅ Delete a comment (only if user is the creator)
      delete: async (req, res, next) => {
          try {
          const comment = await Comment.findById(req.params.id);
          if (!comment) return response(res, 404, false, '❌ Comment not found');
  
          // Only the creator can delete their comment
          if (comment.creator.toString() !== req.userId) {
              return response(res, 403, false, '❌ Not authorized to delete this comment');
          }
  
          await comment.deleteOne();
          return response(res, 200, true, '✅ Comment deleted successfully');
          } catch (error) {
          next(error);
          }
      }
};

export default commentController;
