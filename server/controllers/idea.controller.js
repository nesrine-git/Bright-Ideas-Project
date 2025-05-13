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

  // ✅ Get most supported ideas
  getMostSupported: async (req, res, next) => {
    try {
      const ideas = await Idea.find().populate('creator', POPULATE_CREATOR).lean();

      const sorted = ideas
        .map(idea => ({ ...idea, supportCount: idea.supports.length }))
        .sort((a, b) => b.supportCount - a.supportCount)
        .slice(0, 10);

      return response(res, 200, true, '✅ Most supported ideas retrieved', sorted);
    } catch (err) {
      next(err);
    }
  },

  // ✅ Get most inspiring ideas
  getMostInspiring: async (req, res, next) => {
    try {
      const ideas = await Idea.find().populate('creator', POPULATE_CREATOR).lean();

      const sorted = ideas
        .map(idea => ({ ...idea, inspirationCount: idea.inspirations.length }))
        .sort((a, b) => b.inspirationCount - a.inspirationCount)
        .slice(0, 10);

      return response(res, 200, true, '✅ Most inspiring ideas retrieved', sorted);
    } catch (err) {
      next(err);
    }
  },

  // ✅ Toggle inspiration
  toggleInspiration: async (req, res, next) => {
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) return response(res, 404, false, '❌ Idea not found');

      const userId = req.userId;
      const inspired = idea.inspirations.includes(userId);

      if (inspired) {
        idea.inspirations.pull(userId);
      } else {
        idea.inspirations.push(userId);
      }

      await idea.save();

      await notificationController.sendNotification({
        recipientUserId: idea.creator,
        senderId: userId,
        ideaId: idea._id,
        type: 'inspiration',
        content: `${userId} ${inspired ? 'removed inspiration' : 'was inspired by your idea!'}`,
      });

      const updatedIdea = await Idea.findById(idea._id).populate('creator', POPULATE_CREATOR);
      return response(res, 200, true, '✅ Inspiration toggled', updatedIdea);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Toggle support
  toggleSupport: async (req, res, next) => {
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) return response(res, 404, false, '❌ Idea not found');

      const userId = req.userId;
      const supported = idea.supports.includes(userId);

      if (supported) {
        idea.supports.pull(userId);
      } else {
        idea.supports.push(userId);
      }

      await idea.save();

      await notificationController.sendNotification({
        recipientUserId: idea.creator,
        senderId: userId,
        ideaId: idea._id,
        type: 'support',
        content: `${userId} ${supported ? 'withdrew support from' : 'supported'} your idea!`,
      });

      const updatedIdea = await Idea.findById(idea._id).populate('creator', POPULATE_CREATOR);
      return response(res, 200, true, '✅ Support toggled', updatedIdea);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Get reactions (inspirations & supports)
  getReactions: async (req, res, next) => {
    try {
      const idea = await Idea.findById(req.params.id)
        .populate('inspirations', 'alias name avatar')
        .populate('supports', 'alias name avatar')
        .populate('creator', 'alias'); // or POPULATE_CREATOR if defined
  
      if (!idea) return response(res, 404, false, '❌ Idea not found');
  
      return response(res, 200, true, '✅ Reactions fetched', idea);
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

  // ✅ Get ideas by user
  getByUser: async (req, res, next) => {
    try {
      const ideas = await Idea.find({ creator: req.params.userId })
        .populate('creator', POPULATE_CREATOR)
        .populate('inspirations', 'alias name')
        .populate('supports', 'alias name');

      return response(res, 200, true, '✅ Ideas fetched for user', ideas);
    } catch (err) {
      return response(res, 400, false, '❌ Failed to fetch user ideas', err);
    }
  },
};

export default ideaController;
