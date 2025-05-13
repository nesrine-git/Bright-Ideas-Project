import Idea from '../models/idea.model.js';
import Comment from '../models/comment.model.js';
import response from '../utils/response.js';
import notificationController from './notification.controller.js';

const POPULATE_CREATOR = 'alias name _id';

const ideaController = {
  // ✅ Create a new idea
  create: async (req, res, next) => {
    try {
      const { title, content, emotionalContext } = req.body;
      const creator = req.userId;
      const newIdea = await Idea.create({ title, content, emotionalContext, creator });

      // Populate creator before sending
      const populatedIdea = await Idea.findById(newIdea._id).populate('creator', POPULATE_CREATOR);
      return response(res, 201, true, '✅ Idea created successfully', populatedIdea);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Retrieve all ideas
  getAll: async (req, res, next) => {
    try {
      const ideas = await Idea.find()
        .populate('creator', POPULATE_CREATOR)
        .sort({ createdAt: -1 });

      return response(res, 200, true, '✅ All ideas retrieved', ideas);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Retrieve a single idea
  getOne: async (req, res, next) => {
    try {
      const idea = await Idea.findById(req.params.id).populate('creator', POPULATE_CREATOR);
      if (!idea) return response(res, 404, false, '❌ Idea not found');
      return response(res, 200, true, '✅ Idea retrieved', idea);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Get most liked ideas
  getMostLiked: async (req, res, next) => {
    try {
      const ideas = await Idea.find()
        .sort({ likes: -1 })
        .limit(10)
        .populate('creator', POPULATE_CREATOR);

      return response(res, 200, true, '✅ Most liked ideas retrieved', ideas);
    } catch (err) {
      next(err);
    }
  },

  // ✅ Like / Unlike idea
  toggleLike: async (req, res, next) => {
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) return response(res, 404, false, '❌ Idea not found');

      const userId = req.userId;
      const liked = idea.likes.includes(userId);

      if (liked) {
        idea.likes.pull(userId);
      } else {
        idea.likes.push(userId);
      }

      await idea.save();

      await notificationController.sendNotification({
        recipientUserId: idea.creator,
        senderId: req.userId,
        ideaId: idea._id,
        type: 'like',
        content: `${req.userId} ${liked ? 'unliked' : 'liked'} your idea!`,
      });

      const updatedIdea = await Idea.findById(req.params.id).populate('creator', POPULATE_CREATOR);
      return response(res, 200, true, '✅ Like status updated', updatedIdea);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Create comment
  createComment: async (req, res, next) => {
    try {
      const { content } = req.body;
      const idea = await Idea.findById(req.params.id);
      if (!idea) return response(res, 404, false, '❌ Idea not found');

      const newComment = await Comment.create({
        content,
        idea: idea._id,
        creator: req.userId,
      });

      idea.comments.push(newComment._id);
      await idea.save();

      await notificationController.sendNotification({
        recipientUserId: idea.creator,
        senderId: req.userId,
        ideaId: idea._id,
        type: 'comment',
        content: `${req.userId} commented on your idea!`,
      });

      return response(res, 201, true, '✅ Comment added', newComment);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Update idea
  update: async (req, res, next) => {
    try {
      const idea = await Idea.findById(req.params.id).populate('creator', POPULATE_CREATOR);
      if (!idea) return response(res, 404, false, '❌ Idea not found');

      const creatorId = idea.creator._id?.toString() || idea.creator.toString();
      if (creatorId !== req.userId) {
        return response(res, 403, false, '⛔ You are not allowed to update this idea');
      }

      const { title, content, emotionalContext } = req.body;
      if (title) idea.title = title;
      if (content) idea.content = content;
      if ('emotionalContext' in req.body) {
        idea.emotionalContext = emotionalContext;
      }

      await idea.save();
      const updatedIdea = await Idea.findById(req.params.id).populate('creator', POPULATE_CREATOR);
      return response(res, 200, true, '✅ Idea updated successfully', updatedIdea);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Delete idea
  delete: async (req, res, next) => {
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) return response(res, 404, false, '❌ Idea not found');

      if (idea.creator.toString() !== req.userId) {
        return response(res, 403, false, '❌ Not authorized to delete this idea');
      }

      await idea.deleteOne();
      return response(res, 200, true, '✅ Idea deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // ✅ Get likes (with populated creator)
  getLikes: async (req, res, next) => {
    try {
      const idea = await Idea.findById(req.params.id)
        .populate('likes', 'alias name')
        .populate('creator', POPULATE_CREATOR);

      if (!idea) return response(res, 404, false, '❌ Idea not found');
      return response(res, 200, true, '✅ Likes fetched', idea);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Get ideas by user
  getByUser: async (req, res, next) => {
    try {
      const ideas = await Idea.find({ creator: req.params.userId })
        .populate('creator', POPULATE_CREATOR)
        .populate('likes', 'alias name');

      return response(res, 200, true, '✅ Ideas fetched for user', ideas);
    } catch (err) {
      return response(res, 400, false, '❌ Failed to fetch user ideas', err);
    }
  },
};

export default ideaController;
