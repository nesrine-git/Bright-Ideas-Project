import mongoose, { Schema, model } from 'mongoose';

const ideaSchema = new Schema(
  {
    title: {
        type: String,
        required: [true, 'Idea title is required'],
        minlength: [5, 'Title must be at least 5 characters long'],
      },
    content: {
      type: String,
      required: [true, 'Idea content is required'],
      minlength: [25, 'Idea must be at least 25 characters long']
    },
    emotionalContext: {
        type: String,
        required: false,
      },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

const Idea = model('Idea', ideaSchema);
export default Idea;
