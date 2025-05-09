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
        const idea = await Idea.findById(req.params.id);
        if (!idea) return response(res, 404, false, '❌ Idea not found');

        const userId = req.userId;
        const alreadyLiked = idea.likes.includes(userId);

        if (alreadyLiked) {
            // If already liked, remove like
            idea.likes.pull(userId);
        } else {
            // Otherwise, add like
            idea.likes.push(userId);
        }

        await idea.save();
        return response(res, 200, true, '✅ Like status updated', idea);
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
    };

    export default ideaController;
