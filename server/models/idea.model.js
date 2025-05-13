import mongoose, { Schema, model } from 'mongoose';

const ideaSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, '{PATH} title is required'],
      minlength: [5, 'Title must be at least 5 characters long'],
    },
    content: {
      type: String,
      required: [true, '{PATH} content is required'],
      minlength: [25, '{PATH} must be at least 25 characters long'],
    },
    emotionalContext: {
      type: String,
      required: false,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 👇 Replace "likes" with more specific reactions
    inspirations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    supports: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Idea = model('Idea', ideaSchema);
export default Idea;
