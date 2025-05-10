    import Idea from '../models/idea.model.js';
    import response from '../utils/response.js';

    // All logic related to creating, retrieving, liking, and deleting ideas
    const ideaController = {
    // ✅ Create a new idea
    create: async (req, res, next) => {
        try {
        const { title, content, emotionalContext } = req.body;
        const creator = req.userId; // userId is set by the authenticate middleware
        console.log(creator)
        const newIdea = await Idea.create({ title, content, emotionalContext, creator });

        return response(res, 201, true, '✅ Idea created successfully', newIdea);
        } catch (error) {
        next(error); // forward error to error-handling middleware
        }
    },

    // ✅ Retrieve all ideas (most recent first)
    getAll: async (req, res, next) => {
        try {
        const ideas = await Idea.find()
            .populate('creator') // get all creator object
            .sort({ createdAt: -1 });

        return response(res, 200, true, '✅ All ideas retrieved', ideas);
        } catch (error) {
        next(error);
        }
    },

    // ✅ Retrieve all ideas (most liked)
    getMostLiked: async (req, res, next) => {
        try {
            const ideas = await Idea.aggregate([
                {
                    $addFields: { likesCount: { $size: "$likes" } }
                },
                {
                    $sort: { likesCount: -1, createdAt: -1 }
                }
            ]);
    
            // Repopulate `creator` manually since `aggregate` doesn't auto-populate
            const populatedIdeas = await Idea.populate(ideas, { path: 'creator' });
    
            return response(res, 200, true, '✅ Ideas sorted by most likes', populatedIdeas);
        } catch (error) {
            next(error);
        }
    },
    
    // ✅ Retrieve a single idea by ID
    getOne: async (req, res, next) => {
        try {
        const idea = await Idea.findById(req.params.id)
            .populate('creator');

        if (!idea) return response(res, 404, false, '❌ Idea not found');

        return response(res, 200, true, '✅ Idea retrieved', idea);
        } catch (error) {
        next(error);
        }
    },

    // ✅ Like or unlike an idea
    toggleLike: async (req, res, next) => {
        try {
            const userId = req.userId; // assuming you're using a JWT auth middleware that sets req.user
            const idea = await Idea.findById(req.params.id);
        
            if (!idea) return res.status(404).json({ message: 'Idea not found' });
        
            const alreadyLiked = idea.likes.includes(userId);
        
            if (alreadyLiked) {
              idea.likes = idea.likes.filter(id => id.toString() !== userId.toString());
            } else {
              idea.likes.push(userId);
            }
        

        await idea.save();
        const updatedIdea = await Idea.findById(idea._id).populate('creator'); // Add .lean() if you want plain object
        return response(res, 200, true, '✅ Like status updated', updatedIdea);

        } catch (error) {
        next(error);
        }
    },
    // ✅ Update an idea (only if user is the creator)
        update: async (req, res, next) => {
            try {
            const idea = await Idea.findById(req.params.id);
            if (!idea) {
                return response(res, 404, false, '❌ Idea not found');
            }
        
            // Check if the logged-in user is the creator of the idea
            const creatorId = idea.creator._id?.toString() || idea.creator.toString();
            if (creatorId !== req.userId) {
                return response(res, 403, false, '⛔ You are not allowed to update this idea');
            }
        
            // Apply allowed updates
            const { title, content, emotionalContext } = req.body;
            if (title) idea.title = title;
            if (content) idea.content = content;
            if (emotionalContext) idea.emotionalContext = emotionalContext;
        
            await idea.save();
        
            return response(res, 200, true, '✅ Idea updated successfully', idea);
            } catch (error) {
            next(error);
            }
        },
        
    // ✅ Delete an idea (only if user is the creator)
    delete: async (req, res, next) => {
        try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) return response(res, 404, false, '❌ Idea not found');

        // Only the creator can delete their idea
        if (idea.creator.toString() !== req.userId) {
            return response(res, 403, false, '❌ Not authorized to delete this idea');
        }

        await idea.deleteOne();
        return response(res, 200, true, '✅ Idea deleted successfully');
        } catch (error) {
        next(error);
        }
    },

    // in your idea.controller.js
    getLikes: async (req, res) => {
            const idea = await Idea.findById(req.params.id).populate('likes', 'alias name');
            return response(res, 200, true, '👍 Likers fetched', idea.likes);
        }
  
    };

    export default ideaController;
